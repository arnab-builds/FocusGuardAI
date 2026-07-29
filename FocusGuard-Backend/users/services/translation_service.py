from collections.abc import Mapping
from datetime import date, datetime, time, timedelta
from decimal import Decimal
from typing import Any
from uuid import UUID

from users.services.sarvam_service import translate_using_sarvam


# Updated to match Sarvam language codes
DEFAULT_LANGUAGE_CODE = "en-IN"


def get_user_language(request: Any) -> str:
    """
    Return the authenticated user's preferred language code.

    Falls back to English when:
    - User is not authenticated
    - User has no preferred language
    """

    user = getattr(request, "user", None)

    if not user or not getattr(user, "is_authenticated", False):
        return DEFAULT_LANGUAGE_CODE

    preferred_language = getattr(user, "preferred_language", None)

    if not preferred_language:
        return DEFAULT_LANGUAGE_CODE

    # Return the language code instead of the Language object
    return preferred_language.language_code


def translate_text(text: str, language: str) -> str:
    """
    Translate text through the configured translation provider.

    Keeping provider-specific logic inside this function
    allows the recursive translation engine to remain unchanged.
    """

    return translate_using_sarvam(text, language)


def translate_response(
    response_data: Any,
    language: str | None = None,
    request: Any = None,
) -> Any:
    """
    Recursively translate response values.

    Dictionary keys are NEVER translated because they are part
    of the backend API contract.

    Only string values are translated.
    """

    target_language = language

    if target_language is None and request is not None:
        target_language = get_user_language(request)

    if target_language is None:
        target_language = DEFAULT_LANGUAGE_CODE

    if isinstance(response_data, str):
        return translate_text(response_data, target_language)

    if _should_preserve_value(response_data):
        return response_data

    if isinstance(response_data, Mapping):
        return {
            key: translate_response(value, target_language)
            for key, value in response_data.items()
        }

    if isinstance(response_data, list):
        return [
            translate_response(item, target_language)
            for item in response_data
        ]

    return response_data


def _should_preserve_value(value: Any) -> bool:
    """
    Preserve non-string values exactly as they are.
    """

    return value is None or isinstance(
        value,
        (
            bool,
            int,
            float,
            Decimal,
            datetime,
            date,
            time,
            timedelta,
            UUID,
            bytes,
            bytearray,
        ),
    )
