from dataclasses import dataclass
from datetime import datetime
import re
from typing import Any
from uuid import UUID

from rest_framework.response import Response

from users.services.translation_service import (
    DEFAULT_LANGUAGE_CODE,
    get_user_language,
    translate_response,
)


SENSITIVE_KEY_PARTS = (
    "access",
    "refresh",
    "token",
    "password",
    "secret",
    "key",
    "code",
    "email",
    "username",
    "first_name",
    "last_name",
    "full_name",
    "website_name",
    "website",
    "domain",
    "company_name",
    "application_name",
    "product_name",
    "brand_name",
    "employee_name",
    "organization_name",
    "employee",
    "reviewed_by",
    "requested_by",
    "tab_title",
    "organization",
    "url",
    "uri",
    "image",
    "avatar",
    "photo",
)

EXACT_CONTRACT_KEYS = {
    "id",
    "pk",
    "role",
    # Status is a database enum. Clients use its PENDING/APPROVED/REJECTED
    # values to decide which request actions are available.
    "status",
    # These values are machine-readable enums used by the activity-history
    # UI for status styling and analytics calculations. Translating them
    # turns PRODUCTIVE into display text and makes every row hit the
    # non-productive fallback.
    "productivity_type",
    "language_code",
    "name",
    # AI responses are already generated in the user's preferred language.
    # Protecting them avoids a second provider pass and preserves prompt-level
    # proper-noun instructions, while error/message fields still translate.
    "response",
    "company",
    "application",
    "product",
    "brand",
}

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
URL_PATTERN = re.compile(r"^(?:https?://|www\.)", re.IGNORECASE)
JWT_PATTERN = re.compile(r"^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$")


@dataclass(frozen=True)
class ProtectedValue:
    value: Any


class TranslatedResponseMixin:
    """
    Opt-in APIView mixin for translating response values in common APIs.

    Views using this mixin keep their existing business logic and return normal
    DRF Response objects. During finalization, response data is routed through
    the centralized translation engine, with API contract values protected.
    """

    translation_user = None
    translation_language = None

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(
            request,
            response,
            *args,
            **kwargs,
        )

        if isinstance(response, Response) and hasattr(response, "data"):
            response.data = translate_api_response(
                response.data,
                request=request,
                user=getattr(self, "translation_user", None),
                language=getattr(self, "translation_language", None),
            )

        return response


def translate_api_response(
    data: Any,
    request: Any = None,
    user: Any = None,
    language: str | None = None,
) -> Any:
    """
    Translate API response values while preserving sensitive string values.

    JWTs, emails, URLs, IDs, and other contract identifiers are strings in many
    responses. They are temporarily wrapped before calling translate_response()
    so the centralized recursive translator can still process the full payload
    without sending protected values to the provider.
    """
    # Public clients keep the active UI language locally until a profile
    # update is saved. Honour the explicit request language first so that
    # translated API data (notifications, analytics, etc.) cannot drift from
    # the language currently displayed by the frontend.
    requested_language = (
        request.query_params.get("language")
        if request is not None
        else None
    )
    target_language = (
        language
        or requested_language
        or _get_language_from_user(user)
        or (get_user_language(request) if request is not None else None)
        or DEFAULT_LANGUAGE_CODE
    )

    masked_data = _mask_untranslatable_values(data)
    translated_data = translate_response(
        masked_data,
        language=target_language,
    )

    return _unmask_protected_values(translated_data)


def _get_language_from_user(user: Any) -> str | None:
    if not user:
        return None

    preferred_language = getattr(user, "preferred_language", None)

    if not preferred_language:
        return None

    return getattr(preferred_language, "language_code", preferred_language)


def _mask_untranslatable_values(data: Any, key: Any = None) -> Any:
    if _should_protect_value(data, key):
        return ProtectedValue(data)

    if isinstance(data, dict):
        return {
            item_key: _mask_untranslatable_values(item_value, item_key)
            for item_key, item_value in data.items()
        }

    if isinstance(data, list):
        return [
            _mask_untranslatable_values(item)
            for item in data
        ]

    return data


def _unmask_protected_values(data: Any) -> Any:
    if isinstance(data, ProtectedValue):
        return data.value

    if isinstance(data, dict):
        return {
            key: _unmask_protected_values(value)
            for key, value in data.items()
        }

    if isinstance(data, list):
        return [
            _unmask_protected_values(item)
            for item in data
        ]

    return data


def _should_protect_value(value: Any, key: Any = None) -> bool:
    if _is_protected_key(key):
        return True

    if not isinstance(value, str):
        return False

    if not value.strip():
        return True

    return (
        _looks_like_email(value)
        or _looks_like_url(value)
        or _looks_like_jwt(value)
        or _looks_like_uuid(value)
        or _looks_like_datetime(value)
    )


def _is_protected_key(key: Any) -> bool:
    if key is None:
        return False

    key_text = str(key).lower()

    if key_text in EXACT_CONTRACT_KEYS:
        return True

    return any(part in key_text for part in SENSITIVE_KEY_PARTS)


def _looks_like_email(value: str) -> bool:
    return bool(EMAIL_PATTERN.match(value))


def _looks_like_url(value: str) -> bool:
    return bool(URL_PATTERN.match(value))


def _looks_like_jwt(value: str) -> bool:
    return bool(JWT_PATTERN.match(value))


def _looks_like_uuid(value: str) -> bool:
    try:
        UUID(value)
    except (TypeError, ValueError):
        return False

    return True


def _looks_like_datetime(value: str) -> bool:
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return False

    return True
