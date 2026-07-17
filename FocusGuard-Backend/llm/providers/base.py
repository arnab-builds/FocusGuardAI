from abc import ABC, abstractmethod


class BaseLLMProvider(ABC):

    @abstractmethod
    def generate(self, system_prompt: str, user_prompt: str):
        """
        Generate a response from the LLM.
        """
        pass