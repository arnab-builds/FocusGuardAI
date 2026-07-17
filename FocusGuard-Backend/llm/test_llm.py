from llm.manager import LLMManager
from llm.prompts import SYSTEM_PROMPT


manager = LLMManager()

response = manager.generate(
    SYSTEM_PROMPT,
    "Say hello in one sentence."
)

print(response)