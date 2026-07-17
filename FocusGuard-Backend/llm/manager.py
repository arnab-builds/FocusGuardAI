from django.conf import settings

from .providers.gemini import GeminiProvider


class LLMManager:

    def __init__(self):
        self.primary_llm = settings.PRIMARY_LLM.lower()

    def generate(self, system_prompt: str, user_prompt: str):

        # Temporary implementation
        # We'll add Grok and OpenAI fallback next.

        provider = GeminiProvider()

        return provider.generate(system_prompt, user_prompt)