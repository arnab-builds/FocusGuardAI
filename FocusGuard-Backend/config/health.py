from django.http import JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def health(request):
    """Return a lightweight liveness response without external dependencies."""
    return JsonResponse({"status": "ok"})
