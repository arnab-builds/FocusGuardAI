from django.conf import settings

from .providers.grok import GrokProvider
from .providers.gemini import GeminiProvider
from .providers.openai import OpenAIProvider

from .exceptions import LLMConnectionError


class LLMManager:

    def __init__(self):
        self.primary = settings.PRIMARY_LLM.lower()

    def generate(self, system_prompt: str, user_prompt: str):

        providers = []

        if self.primary == "grok":
            providers = [
                GrokProvider(),
                GeminiProvider(),
                OpenAIProvider(),
            ]

        elif self.primary == "gemini":
            providers = [
                GeminiProvider(),
                GrokProvider(),
                OpenAIProvider(),
            ]

        else:
            providers = [
                OpenAIProvider(),
                GeminiProvider(),
                GrokProvider(),
            ]

        last_exception = None

        for provider in providers:
            try:
                return provider.generate(system_prompt, user_prompt)
            except LLMConnectionError as e:
                last_exception = e
                continue

        raise last_exception