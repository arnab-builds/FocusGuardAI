from google import genai
from django.conf import settings

from .base import BaseLLMProvider
from ..exceptions import LLMConnectionError


class GeminiProvider(BaseLLMProvider):

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate(self, system_prompt: str, user_prompt: str):

        print("🚀 Using Gemini Provider")

        prompt = f"""
{system_prompt}

User Request:
{user_prompt}
"""

        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
            )

            if not response or not response.text:
                raise LLMConnectionError(
                    "Gemini returned an empty response."
                )

            return response.text

        except Exception as e:
            print(f"❌ Gemini Provider Error: {e}")

            raise LLMConnectionError(
                f"Gemini Error: {str(e)}"
            )