from django.conf import settings

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