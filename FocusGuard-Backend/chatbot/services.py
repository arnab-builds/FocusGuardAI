from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
import json

from google import genai
from groq import Groq

from .prompts import SYSTEM_PROMPT


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
):
    return f"""
{SYSTEM_PROMPT}

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
        else:
            question, analytics, activity_logs, selected_date = args

        prompt = build_prompt(
            question,
            analytics,
            activity_logs,
            selected_date,
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


def build_organization_admin_prompt(question, context):
    context_json = json.dumps(
        context,
        cls=DjangoJSONEncoder,
        indent=2,
    )

    return f"""
You are FocusGuardAI's Organization Admin Assistant.

Answer ONLY from the organization admin context below. Do not use generic
assumptions and do not invent employees, websites, time, productivity, requests,
or notifications. If the context does not contain enough data, say what is
missing and answer as far as the context allows.

Use concise, practical language for an organization administrator. When useful,
name the employee, website/category, duration, productivity percentage, and date
range that support your answer.

Organization Admin Context:
{context_json}

Question:
{question}
"""


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
    )

    content = response.choices[0].message.content

    if not content:
        raise Exception("Grok returned an empty response.")

    return content


def ask_organization_admin_assistant(question, context):
    prompt = build_organization_admin_prompt(question, context)

    try:
        return {
            "response": ask_organization_admin_gemini(prompt),
            "provider": "gemini",
        }
    except Exception as gemini_error:
        print("Organization Admin Gemini Error:", gemini_error)

        try:
            return {
                "response": ask_organization_admin_grok(prompt),
                "provider": "grok",
            }
        except Exception as grok_error:
            print("Organization Admin Grok Error:", grok_error)
            raise Exception(
                "Organization Admin AI service is currently unavailable. "
                f"Gemini failed: {gemini_error}. "
                f"Grok failed: {grok_error}."
            )
