import logging
import os
import re
import time
from functools import lru_cache

import requests
from decouple import config


logger = logging.getLogger(__name__)

SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"
DEFAULT_SOURCE_LANGUAGE = "auto"
ENGLISH_LANGUAGE_CODE = "en-IN"
REQUEST_TIMEOUT_SECONDS = 10
MAX_ATTEMPTS = 2
# The default Mayura model supports source-language auto-detection, which is
# required for arbitrary AI responses. Its input limit is 1,000 characters.
MAX_INPUT_CHARACTERS = 1000
SARVAM_LANGUAGE_ALIASES = {
    "or-IN": "od-IN",
}


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

    api_key = _get_api_key()

    if not api_key:
        logger.warning("Sarvam translation skipped: SARVAM_API_KEY is missing.")
        return text

    return "".join(
        _translate_chunk(chunk, language_code, api_key)
        for chunk in _split_text_for_translation(text)
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

    payload = {
        "input": text,
        "source_language_code": DEFAULT_SOURCE_LANGUAGE,
        "target_language_code": language_code,
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

            return translated_text

        except requests.Timeout:
            logger.warning(
                "Sarvam translation timed out (attempt %s/%s).",
                attempt,
                MAX_ATTEMPTS,
                exc_info=True,
            )
        except requests.HTTPError as error:
            status_code = error.response.status_code if error.response else None
            logger.warning(
                "Sarvam translation HTTP failure (status=%s, attempt %s/%s).",
                status_code,
                attempt,
                MAX_ATTEMPTS,
                exc_info=True,
            )
            if status_code not in {429, 500, 502, 503, 504}:
                break
        except requests.RequestException:
            logger.warning(
                "Sarvam translation request failed (attempt %s/%s).",
                attempt,
                MAX_ATTEMPTS,
                exc_info=True,
            )
        except ValueError:
            logger.exception("Sarvam translation returned invalid JSON.")
            break

        if attempt < MAX_ATTEMPTS:
            time.sleep(0.25)

    return text


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


def _get_language_code(target_language: str) -> str:
    language_code = getattr(target_language, "language_code", target_language)

    return SARVAM_LANGUAGE_ALIASES.get(language_code, language_code)
