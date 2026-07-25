from django.conf import settings

from google import genai
from groq import Groq


def generate_plan_with_gemini(prompt):

    client = genai.Client(
        api_key=settings.FOCUS_PLAN_GEMINI_API_KEY,
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text


def generate_plan_with_groq(prompt):

    client = Groq(
        api_key=settings.FOCUS_PLAN_GROQ_API_KEY,
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content


def generate_focus_plan_ai(prompt):

    try:
        print("========== Focus Plan AI ==========")
        print("Using Gemini...")

        return generate_plan_with_gemini(prompt)

    except Exception as gemini_error:

        print("Gemini failed.")
        print(gemini_error)

        try:
            print("Switching to Groq...")

            return generate_plan_with_groq(prompt)

        except Exception as groq_error:

            print("Groq failed.")
            print(groq_error)

            raise Exception(
                "Unable to generate focus plan."
            )