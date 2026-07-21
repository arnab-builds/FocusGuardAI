from groq import Groq
from django.conf import settings

from .base import BaseLLMProvider
from llm.exceptions import LLMConnectionError


class GrokProvider(BaseLLMProvider):

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def generate(self, system_prompt: str, user_prompt: str):

        print("🚀 Using Groq Provider")

        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_prompt,
                    },
                ],
                temperature=0.5,
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"❌ Groq Provider Error: {e}")

            raise LLMConnectionError(
                f"Groq Error: {str(e)}"
            )