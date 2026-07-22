from google import genai
from django.conf import settings

from .base import BaseLLMProvider
from ..exceptions import LLMConnectionError


class GeminiProvider(BaseLLMProvider):

    def __init__(self, api_type="recommendation"):

        if api_type == "recommendation":
            api_key = settings.GEMINI_RECOMMENDATION_API_KEY

        elif api_type == "category":
            api_key = settings.GEMINI_CATEGORY_API_KEY

        elif api_type == "chat":
            api_key = settings.GEMINI_CHAT_API_KEY

        else:
            raise ValueError(f"Invalid api_type: {api_type}")

        self.client = genai.Client(api_key=api_key)

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