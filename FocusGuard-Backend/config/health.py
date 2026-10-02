import hmac
import logging

from django.conf import settings
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET

logger = logging.getLogger(__name__)


def check_db_connection():
    """Execute a harmless SELECT 1 query using Django's default connection."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        cursor.fetchone()


@require_GET
def health(request):
    """Return a lightweight liveness response without external dependencies."""
    return JsonResponse({"status": "ok"})


@require_GET
def health_db(request):
    """
    Return database liveness for keepalive without reading or modifying data.
    Protected by CLOUDFLARE_DB_HEALTH_SECRET via X-Health-Secret header.
    """
    expected_secret = getattr(settings, "CLOUDFLARE_DB_HEALTH_SECRET", "")
    provided_secret = (
        request.headers.get("X-Health-Secret")
        or request.META.get("HTTP_X_HEALTH_SECRET", "")
    )

    if (
        not expected_secret
        or not provided_secret
        or not hmac.compare_digest(expected_secret, provided_secret)
    ):
        return JsonResponse({"detail": "Forbidden"}, status=403)

    try:
        check_db_connection()
        return JsonResponse({"status": "ok"})
    except Exception:
        logger.exception("Database health check failed")
        return JsonResponse({"status": "error"}, status=503)
