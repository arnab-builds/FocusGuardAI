class LLMError(Exception):
    """Base exception for all LLM errors."""
    pass


class LLMQuotaExceededError(LLMError):
    """Raised when an LLM quota is exceeded."""
    pass


class LLMConnectionError(LLMError):
    """Raised when an LLM cannot be reached."""
    pass