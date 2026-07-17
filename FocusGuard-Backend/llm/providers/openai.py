from .base import BaseLLMProvider
from llm.exceptions import LLMConnectionError


class OpenAIProvider(BaseLLMProvider):

    def generate(self, system_prompt: str, user_prompt: str):
        """
        Placeholder implementation.

        Replace this with the OpenAI API integration
        after adding the API key.
        """
        raise LLMConnectionError("OpenAI provider is not configured.")