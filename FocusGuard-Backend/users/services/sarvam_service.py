import logging
import os
import re
import threading
import time
from html import unescape
from hashlib import sha256
from functools import lru_cache

import requests
from decouple import config
from django.db import DatabaseError, IntegrityError

from users.translations.translation_seed import TRANSLATIONS


logger = logging.getLogger(__name__)

SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"
GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"
DEFAULT_SOURCE_LANGUAGE = "auto"
ENGLISH_LANGUAGE_CODE = "en-IN"
SARVAM_TRANSLATION_MODEL = "mayura:v1"
# Translation is optional UI enrichment. Do not let an unavailable provider
# hold up otherwise healthy API responses for tens of seconds.
REQUEST_TIMEOUT_SECONDS = 2
MAX_ATTEMPTS = 1
CIRCUIT_BREAKER_SECONDS = 30
# The default Mayura model supports source-language auto-detection, which is
# required for arbitrary AI responses. Its input limit is 1,000 characters.
MAX_INPUT_CHARACTERS = 1000
SARVAM_LANGUAGE_ALIASES = {
    "or-IN": "od-IN",
}

# The UI catalog covers the application's known text in every supported
# language. Resolving it locally keeps normal requests fast when a provider is
# slow or unavailable; Sarvam remains available for genuinely new free-form
# text.
CATALOG_LANGUAGE_ALIASES = {
    "od-IN": "or-IN",
}
CATALOG_TRANSLATIONS = {
    source_text: variants
    for variants in TRANSLATIONS.values()
    if (source_text := variants.get(ENGLISH_LANGUAGE_CODE))
}


class SarvamUnavailable(Exception):
    """Raised internally so failed translations are never cached."""


_circuit_lock = threading.Lock()
_circuit_open_until = 0.0


def translate_using_sarvam(text: str, target_language: str) -> str:
    """
    Translate text using Sarvam AI's official Translation REST API.

    This module is the only place that knows about Sarvam. The shared
    translation engine stays provider-independent and can call this function
    without depending on request details, headers, or response parsing.
    """
    language_code = _get_language_code(target_language)

    if not text or language_code == ENGLISH_LANGUAGE_CODE:
        return text

    catalog_translation = _translate_from_catalog(text, language_code)

    if catalog_translation is not None:
        return catalog_translation

    api_key = _get_api_key()

    chunks = _split_text_for_translation(text)

    if not api_key:
        logger.warning("Sarvam translation skipped: SARVAM_API_KEY is missing.")
        return "".join(
            _translate_chunk_with_google(chunk, language_code)
            for chunk in chunks
        )

    try:
        return "".join(
            _translate_chunk(chunk, language_code, api_key)
            for chunk in chunks
        )
    except SarvamUnavailable:
        return "".join(
            _translate_chunk_with_google(chunk, language_code)
            for chunk in chunks
        )


@lru_cache(maxsize=4096)
def _translate_chunk(
    text: str,
    language_code: str,
    api_key: str,
) -> str:
    """Translate one provider-safe chunk, retaining the existing retries."""
    # Whitespace is retained locally so paragraph and line-break formatting is
    # not dependent on the translation provider preserving it.
    if not text.strip():
        return text

    cached_translation = _get_runtime_translation(text, language_code)

    if cached_translation is not None:
        return cached_translation

    if _is_circuit_open():
        raise SarvamUnavailable

    payload = {
        "input": text,
        "source_language_code": DEFAULT_SOURCE_LANGUAGE,
        "target_language_code": language_code,
        # Pin the documented low-latency translation model. Relying on the
        # provider default caused intermittent read timeouts in production.
        "model": SARVAM_TRANSLATION_MODEL,
    }

    headers = {
        "api-subscription-key": api_key,
        "Content-Type": "application/json",
    }

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            response = requests.post(
                SARVAM_TRANSLATE_URL,
                json=payload,
                headers=headers,
                timeout=REQUEST_TIMEOUT_SECONDS,
            )
            response.raise_for_status()

            data = response.json()
            translated_text = data.get("translated_text")

            if not isinstance(translated_text, str):
                logger.warning(
                    "Sarvam translation returned an invalid response shape."
                )
                return text

            _store_runtime_translation(
                text,
                language_code,
                translated_text,
            )
            return translated_text

        except requests.Timeout:
            logger.warning(
                "Sarvam translation timed out (attempt %s/%s).",
                attempt,
                MAX_ATTEMPTS,
            )
        except requests.HTTPError as error:
            status_code = error.response.status_code if error.response else None
            logger.warning(
                "Sarvam translation HTTP failure (status=%s, attempt %s/%s).",
                status_code,
                attempt,
                MAX_ATTEMPTS,
            )
            if status_code not in {429, 500, 502, 503, 504}:
                break
        except requests.RequestException:
            logger.warning(
                "Sarvam translation request failed (attempt %s/%s).",
                attempt,
                MAX_ATTEMPTS,
            )
        except ValueError:
            logger.exception("Sarvam translation returned invalid JSON.")
            break

        if attempt < MAX_ATTEMPTS:
            time.sleep(0.25)

    _open_circuit()
    raise SarvamUnavailable


def _is_circuit_open() -> bool:
    with _circuit_lock:
        return time.monotonic() < _circuit_open_until


def _open_circuit() -> None:
    global _circuit_open_until

    with _circuit_lock:
        _circuit_open_until = time.monotonic() + CIRCUIT_BREAKER_SECONDS
        logger.warning(
            "Sarvam translation temporarily disabled for %s seconds after a failure.",
            CIRCUIT_BREAKER_SECONDS,
        )


def _split_text_for_translation(text: str) -> list[str]:
    """Split oversized text on whitespace while preserving exact ordering."""
    if len(text) <= MAX_INPUT_CHARACTERS:
        return [text]

    chunks = []
    current = ""

    for token in re.findall(r"\S+|\s+", text):
        # Preserve formatting separators independently at a chunk boundary.
        if token.isspace() and not current:
            chunks.append(token)
            continue

        if current and len(current) + len(token) > MAX_INPUT_CHARACTERS:
            chunks.append(current)
            current = ""

            if token.isspace():
                chunks.append(token)
                continue

        # A single unbroken token can exceed the provider limit (for example a
        # generated URL-like string). Split it deterministically rather than
        # issuing an invalid request.
        while len(token) > MAX_INPUT_CHARACTERS:
            if current:
                chunks.append(current)
                current = ""
            chunks.append(token[:MAX_INPUT_CHARACTERS])
            token = token[MAX_INPUT_CHARACTERS:]

        current += token

    if current:
        chunks.append(current)

    return chunks


def _get_api_key() -> str:
    return os.environ.get("SARVAM_API_KEY") or config(
        "SARVAM_API_KEY",
        default="",
    )


def _get_google_api_key() -> str:
    return os.environ.get("GOOGLE_TRANSLATE_API_KEY") or config(
        "GOOGLE_TRANSLATE_API_KEY",
        default="",
    )


def _translate_chunk_with_google(text: str, language_code: str) -> str:
    """Use Google Cloud Translation only when Sarvam is unavailable."""
    if not text.strip():
        return text

    cached_translation = _get_runtime_translation(text, language_code)

    if cached_translation is not None:
        return cached_translation

    api_key = _get_google_api_key()

    if not api_key:
        return text

    try:
        response = requests.post(
            GOOGLE_TRANSLATE_URL,
            params={"key": api_key},
            json={
                "q": text,
                "target": language_code.split("-", 1)[0],
                "format": "text",
            },
            timeout=(3, 8),
        )
        response.raise_for_status()
        translations = response.json().get("data", {}).get("translations", [])
        translated_text = (
            translations[0].get("translatedText")
            if translations and isinstance(translations[0], dict)
            else None
        )

        if not isinstance(translated_text, str):
            logger.warning("Google translation returned an invalid response shape.")
            return text

        translated_text = unescape(translated_text)
        _store_runtime_translation(text, language_code, translated_text)
        return translated_text
    except requests.RequestException:
        logger.warning("Google translation fallback request failed.")
    except ValueError:
        logger.warning("Google translation fallback returned invalid JSON.")

    return text


def _translate_from_catalog(text: str, language_code: str) -> str | None:
    """Return an exact local translation for known application text."""
    variants = CATALOG_TRANSLATIONS.get(text)

    if not variants:
        return None

    catalog_language_code = CATALOG_LANGUAGE_ALIASES.get(
        language_code,
        language_code,
    )
    translated_text = variants.get(catalog_language_code)

    return translated_text if isinstance(translated_text, str) else None


def _get_runtime_translation(text: str, language_code: str) -> str | None:
    """Read a provider result cached across server restarts."""
    from users.models import RuntimeTranslation

    try:
        cached = RuntimeTranslation.objects.filter(
            source_digest=_translation_digest(text),
            source_text=text,
            target_language_code=language_code,
        ).only("translated_text").first()
    except DatabaseError:
        return None

    return cached.translated_text if cached else None


def _store_runtime_translation(
    source_text: str,
    target_language_code: str,
    translated_text: str,
) -> None:
    """Persist a successful provider result without affecting responses."""
    from users.models import RuntimeTranslation

    try:
        RuntimeTranslation.objects.update_or_create(
            source_digest=_translation_digest(source_text),
            target_language_code=target_language_code,
            defaults={
                "source_text": source_text,
                "translated_text": translated_text,
            },
        )
    except (DatabaseError, IntegrityError):
        logger.warning("Runtime translation cache could not be updated.")


def _translation_digest(text: str) -> str:
    return sha256(text.encode("utf-8")).hexdigest()


def _get_language_code(target_language: str) -> str:
    language_code = getattr(target_language, "language_code", target_language)

    return SARVAM_LANGUAGE_ALIASES.get(language_code, language_code)
