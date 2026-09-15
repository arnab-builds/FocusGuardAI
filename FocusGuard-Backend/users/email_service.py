import logging
import requests
from django.conf import settings
from decouple import config

logger = logging.getLogger(__name__)

class BrevoAPIError(Exception):
    """Exception raised when Brevo API fails to send an email."""
    pass

def send_brevo_email(subject, message, recipient_email):
    """
    Sends a transactional email via Brevo's HTTPS API.
    """
    api_key = config("BREVO_API_KEY", default="")
    if not api_key:
        logger.error("Brevo API Configuration Error: BREVO_API_KEY is missing.")
        raise BrevoAPIError("BREVO_API_KEY environment variable is missing.")

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL, "name": "FocusGuardAI"},
        "to": [{"email": recipient_email}],
        "subject": subject,
        "textContent": message
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        if e.response is not None:
            logger.error(f"Brevo API HTTP Error: {e.response.status_code} - Response: {e.response.text}")
        else:
            logger.error(f"Brevo API Network/Timeout Error: {str(e)}")
        raise BrevoAPIError(f"Brevo API error: {str(e)}")
