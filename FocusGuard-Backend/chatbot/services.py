import os

from decouple import config
from google import genai
from groq import Groq

from .prompts import SYSTEM_PROMPT


gemini_client = genai.Client(
    api_key=config("GEMINI_CHATBOT_API_KEY")
)

groq_client = Groq(
    api_key=config("GROQ_CHATBOT_API_KEY")
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
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    return response.choices[0].message.content


def ask_chatbot(
    question,
    analytics,
    activity_logs,
    selected_date,
):
    prompt = build_prompt(
        question,
        analytics,
        activity_logs,
        selected_date,
    )

    try:
        return ask_gemini(prompt)

    except Exception as gemini_error:

        print("Gemini Error:", gemini_error)

        try:
            return ask_groq(prompt)

        except Exception as groq_error:

            print("Groq Error:", groq_error)

            raise Exception(
                "AI service is currently unavailable."
            )