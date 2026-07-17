from google import genai
from django.conf import settings

from .base import BaseLLMProvider


class GeminiProvider(BaseLLMProvider):
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate(self, system_prompt: str, user_prompt: str):
        prompt = f"""
{system_prompt}

User Request:
{user_prompt}
"""

        response = self.client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )

        return response.text