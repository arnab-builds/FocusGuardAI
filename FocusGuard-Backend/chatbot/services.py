from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
import json
import re
from datetime import timedelta

from google import genai
from groq import Groq

from .prompts import SYSTEM_PROMPT
from users.services.sarvam_service import translate_using_sarvam


# The Groq on-demand tier used by this project accepts at most 8,000 TPM.
# Keep the serialized admin context deliberately well below that budget so
# variable-sized activity data cannot make a request fail before inference.
ORGANIZATION_ADMIN_CONTEXT_CHAR_LIMIT = 8_000


gemini_client = genai.Client(
    api_key=settings.CHATBOT_GEMINI_API_KEY
)

groq_client = Groq(
    api_key=settings.CHATBOT_GROQ_API_KEY
)


def build_prompt(
    question,
    analytics,
    activity_logs,
    selected_date,
    language="en-IN",
):
    return f"""
{SYSTEM_PROMPT}

The user's preferred language is {language}. Answer entirely in that language.
Never translate usernames, people names, company names, brands, or website names.

Selected Date:
{selected_date}

Analytics:
{analytics}

Activity Logs:
{activity_logs}

User Question:
{question}
"""


def ask_gemini(prompt):

    response = gemini_client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    return response.text


def ask_groq(prompt):

    response = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content


def ask_chatbot(*args, **kwargs):

    if len(args) == 1 and not kwargs:

        # Direct prompt (kept for compatibility)
        prompt = args[0]

    else:

        if kwargs:
            question = kwargs["question"]
            analytics = kwargs["analytics"]
            activity_logs = kwargs["activity_logs"]
            selected_date = kwargs["selected_date"]
            language = kwargs.get("language", "en-IN")
        else:
            question, analytics, activity_logs, selected_date = args
            language = "en-IN"

        prompt = build_prompt(
            question,
            analytics,
            activity_logs,
            selected_date,
            language,
        )

    try:

        print("========== AI Coach ==========")
        print("Using Gemini...")

        return ask_gemini(prompt)

    except Exception as gemini_error:

        print("Gemini Error:", gemini_error)

        try:

            print("Switching to Groq...")

            return ask_groq(prompt)

        except Exception as groq_error:

            print("Groq Error:", groq_error)

            raise Exception(
                "AI service is currently unavailable."
            )


def _compact_organization_admin_context(context):
    """Return a bounded copy of the variable-size admin context."""
    compact_context = context.copy()
    variable_sections = (
        "activity_logs",
        "employees",
        "website_summary",
        "requests",
        "notifications",
    )

    for section in variable_sections:
        compact_context[section] = list(context.get(section, []))

    def serialize():
        return json.dumps(
            compact_context,
            cls=DjangoJSONEncoder,
            separators=(",", ":"),
        )

    context_json = serialize()
    while len(context_json) > ORGANIZATION_ADMIN_CONTEXT_CHAR_LIMIT:
        largest_section = max(
            variable_sections,
            key=lambda section: len(compact_context[section]),
        )
        if not compact_context[largest_section]:
            break

        # Lists are newest-first in the view, so retain the newest records.
        compact_context[largest_section].pop()
        context_json = serialize()

    return context_json


def build_organization_admin_prompt(question, context, language="en-IN"):
    context_json = _compact_organization_admin_context(context)

    return f"""
You are FocusGuardAI's Organization Admin Assistant.

Answer ONLY from the organization admin context below. Do not use generic
assumptions and do not invent employees, websites, time, productivity, requests,
or notifications. If the context does not contain enough data, say what is
missing and answer as far as the context allows.

For a ranked or listed request, provide the requested list first. Zero activity
is still valid data: show the employees and their zero values instead of saying
that a ranking cannot be generated. Do not add a long explanation unless the
administrator asks for one.

Use concise, practical language for an organization administrator. When useful,
name the employee, website/category, duration, productivity percentage, and date
range that support your answer.

Reply like a helpful colleague in a normal chat. Use short paragraphs or simple
bullets; do not use Markdown headings or tables unless the administrator
explicitly asks for a report, table, or detailed breakdown.
Never begin with a title, snapshot label, or date-range heading. Do not use bold
Markdown markers. For a summary, give the key outcome first, then at most three
short supporting points.

The user's preferred language is {language}. Answer entirely in that language,
but preserve usernames, people names, organization names, brands, and website
names exactly as provided.

Organization Admin Context:
{context_json}

Question:
{question}
"""


def _top_productive_employees_response(question, context):
    """Produce a useful, deterministic answer for the dashboard shortcut."""
    normalized_question = question.casefold()
    if not any(
        phrase in normalized_question
        for phrase in (
            "top productive employee",
            "top productivity employee",
            "most productive employee",
        )
    ):
        return None

    employees = context.get("employees", [])
    ranked_employees = sorted(
        employees,
        key=lambda employee: (
            -float(employee.get("selected_date_analytics", {}).get(
                "productive_percentage", 0
            )),
            employee.get("username", "").casefold(),
        ),
    )

    if not ranked_employees:
        return "No employees are assigned to this organization."

    employee_summaries = []
    for rank, employee in enumerate(ranked_employees[:5], start=1):
        analytics = employee.get("selected_date_analytics", {})
        employee_summaries.append(
            "{rank}) {username} — {productive_time} productive time "
            "({percentage}% productivity)".format(
                rank=rank,
                username=employee.get("username", "Unknown"),
                productive_time=analytics.get("productive_time", "0:00:00"),
                percentage=analytics.get("productive_percentage", 0),
            )
        )

    result = "Here are the top productive employees for the selected date:\n"
    result += "\n".join(employee_summaries) + "."
    if not any(
        employee.get("selected_date_analytics", {}).get(
            "productive_percentage", 0
        )
        for employee in ranked_employees
    ):
        result += (
            "\n\nNo productive activity has been recorded for the selected "
            "date yet; the table shows the current roster ranking."
        )
    return result


def _format_duration(value):
    total_seconds = int((value or timedelta()).total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def _duration_to_seconds(value):
    if isinstance(value, timedelta):
        return value.total_seconds()

    if not value:
        return 0

    value = str(value)
    days = 0
    if " day" in value:
        day_part, value = value.split(", ", 1)
        days = int(day_part.split()[0])

    hours, minutes, seconds = value.split(":")
    return days * 86_400 + int(hours) * 3_600 + int(minutes) * 60 + float(seconds)


def _organization_productivity_response(question, context):
    normalized_question = question.casefold()
    if "organization productivity" not in normalized_question:
        return None

    employees = context.get("employees", [])
    productive_seconds = 0
    non_productive_seconds = 0
    neutral_seconds = 0

    for employee in employees:
        analytics = employee.get("selected_date_analytics", {})
        productive_seconds += _duration_to_seconds(
            analytics.get("productive_time")
        )
        non_productive_seconds += _duration_to_seconds(
            analytics.get("non_productive_time")
        )
        neutral_seconds += _duration_to_seconds(
            analytics.get("neutral_time")
        )

    tracked_seconds = (
        productive_seconds + non_productive_seconds + neutral_seconds
    )
    productivity = (
        round(productive_seconds * 100 / tracked_seconds, 2)
        if tracked_seconds
        else 0
    )
    selected_date = context.get("selected_date", "the selected date")
    response = (
        "Organization productivity for {date} is {productivity}%. "
        "Across {employees} employee{plural}, there was {productive} of "
        "productive time, {non_productive} of non-productive time, and "
        "{neutral} of neutral time."
    ).format(
        date=selected_date,
        productivity=productivity,
        employees=len(employees),
        plural="s" if len(employees) != 1 else "",
        productive=_format_duration(timedelta(seconds=productive_seconds)),
        non_productive=_format_duration(
            timedelta(seconds=non_productive_seconds)
        ),
        neutral=_format_duration(timedelta(seconds=neutral_seconds)),
    )
    if not tracked_seconds:
        response += " No tracked activity has been recorded yet."
    return response


def _organization_summary_response(question, context):
    if not any(
        phrase in question.casefold()
        for phrase in ("generate summary", "organization summary")
    ):
        return None

    employees = context.get("employees", [])
    active_count = sum(employee.get("is_active", False) for employee in employees)
    inactive_count = len(employees) - active_count
    productivity = _organization_productivity_response(
        "organization productivity", context
    )
    websites = context.get("website_summary", [])

    summary = (
        "Here is a quick organization summary for {date}. You have "
        "{employee_count} employee{employee_plural}: {active_count} active"
    ).format(
        date=context.get("selected_date", "the selected date"),
        employee_count=len(employees),
        employee_plural="s" if len(employees) != 1 else "",
        active_count=active_count,
    )
    if inactive_count:
        summary += f" and {inactive_count} inactive"
    summary += ".\n" + productivity
    if websites:
        top_website = websites[0]
        summary += (
            "\nThe most visited website was {website} with {visits} "
            "visit{plural}."
        ).format(
            website=top_website.get("website_name") or "Unknown",
            visits=top_website.get("visits", 0),
            plural="s" if top_website.get("visits", 0) != 1 else "",
        )
    return summary


def _employee_roster_response(question, context):
    normalized_question = question.casefold()
    roster_phrases = (
        "name all employee",
        "list employee",
        "all employee",
        "who are the employee",
        "employee roster",
    )
    if not any(phrase in normalized_question for phrase in roster_phrases):
        return None

    employees = context.get("employees", [])
    if not employees:
        return "There are no employees assigned to this organization yet."

    employee_summaries = [
        "{username} ({status})".format(
            username=employee.get("username", "Unknown"),
            status="active" if employee.get("is_active") else "inactive",
        )
        for employee in employees
    ]
    return (
        "You have {count} employees:\n{employees}"
    ).format(
        count=len(employees),
        employees="\n".join(employee_summaries),
    )


def _inactive_employees_response(question, context):
    if "inactive employee" not in question.casefold():
        return None

    inactive_employees = [
        employee for employee in context.get("employees", [])
        if not employee.get("is_active", True)
    ]
    if not inactive_employees:
        return "Good news—there are no inactive employees right now."

    employee_summaries = [
        "{username} ({email})".format(
            username=employee.get("username", "Unknown"),
            email=employee.get("email", "—"),
        )
        for employee in inactive_employees
    ]
    return (
        "You currently have {count} inactive employee{plural}:\n{employees}."
    ).format(
        count=len(inactive_employees),
        plural="s" if len(inactive_employees) != 1 else "",
        employees="\n".join(employee_summaries),
    )


def _most_visited_websites_response(question, context):
    if "most visited website" not in question.casefold():
        return None

    websites = context.get("website_summary", [])
    if not websites:
        return (
            "No website activity was recorded in the current reporting window."
        )

    website_summaries = []
    for rank, website in enumerate(websites[:5], start=1):
        website_summaries.append(
            "{name} ({category}) — {visits} visit{plural}, {duration}".format(
                name=website.get("website_name") or "Unknown",
                category=website.get("category") or "Uncategorized",
                visits=website.get("visits", 0),
                duration=_format_duration(website.get("total_duration")),
                plural="s" if website.get("visits", 0) != 1 else "",
            )
        )

    return (
        "The most visited websites in the current reporting window are:\n"
        + "\n".join(website_summaries)
        + "."
    )


def _clean_organization_admin_response(response):
    """Keep provider responses readable in the compact chat interface."""
    response = re.sub(r"\*{1,3}([^*]+)\*{1,3}", r"\1", response)
    response = re.sub(r"(?m)^\s{0,3}#{1,6}\s*", "", response)
    response = re.sub(r"(?m)^\s*[-*]\s+", "• ", response)
    response = re.sub(r"\n{3,}", "\n\n", response)
    return response.strip()


def ask_organization_admin_gemini(prompt):
    api_key = settings.GEMINI_ORGANIZATION_ADMIN_API_KEY

    if not api_key:
        raise Exception(
            "GEMINI_ORGANIZATION_ADMIN_API_KEY is not configured."
        )

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=settings.GEMINI_ORGANIZATION_ADMIN_MODEL,
        contents=prompt,
    )

    if not response or not response.text:
        raise Exception("Gemini returned an empty response.")

    return response.text


def ask_organization_admin_grok(prompt):
    api_key = settings.GROK_ORGANIZATION_ADMIN_API_KEY

    if not api_key:
        raise Exception(
            "GROK_ORGANIZATION_ADMIN_API_KEY is not configured."
        )

    client = Groq(api_key=api_key)

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.3,
        # gpt-oss-120b's default completion allowance can make a request
        # exceed the 8k TPM tier even when the question itself is short.
        max_completion_tokens=250,
    )

    content = response.choices[0].message.content

    if not content:
        raise Exception("Grok returned an empty response.")

    return content


def ask_organization_admin_assistant(question, context, language="en-IN"):
    data_response = (
        _top_productive_employees_response(question, context)
        or _organization_productivity_response(question, context)
        or _organization_summary_response(question, context)
        or _employee_roster_response(question, context)
        or _inactive_employees_response(question, context)
        or _most_visited_websites_response(question, context)
    )
    if data_response:
        return {
            "response": translate_using_sarvam(data_response, language),
            "provider": "organization data",
        }

    prompt = build_organization_admin_prompt(question, context, language)

    try:
        return {
            "response": _clean_organization_admin_response(
                translate_using_sarvam(
                    ask_organization_admin_gemini(prompt), language
                )
            ),
            "provider": "gemini",
        }
    except Exception as gemini_error:
        print("Organization Admin Gemini Error:", gemini_error)

        try:
            return {
                "response": _clean_organization_admin_response(
                    translate_using_sarvam(
                        ask_organization_admin_grok(prompt), language
                    )
                ),
                "provider": "grok",
            }
        except Exception as grok_error:
            print("Organization Admin Grok Error:", grok_error)
            raise RuntimeError(
                "Organization Admin AI service is currently unavailable. "
                "Please try again shortly."
            ) from grok_error
