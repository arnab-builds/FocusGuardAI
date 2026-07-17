from django.conf import settings

from .base import BaseLLMProvider
from llm.exceptions import LLMConnectionError


class GrokProvider(BaseLLMProvider):

    def generate(self, system_prompt: str, user_prompt: str):
        """
        Placeholder implementation.

        Replace this with the actual xAI API integration
        once a Grok API key and credits are available.
        """
        raise LLMConnectionError("Grok provider is not configured.")