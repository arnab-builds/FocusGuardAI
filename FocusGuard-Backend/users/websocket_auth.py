from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken, TokenError

from .models import User


@database_sync_to_async
def get_user(token):
    try:
        user_id = AccessToken(token)["user_id"]
    except (TokenError, KeyError, TypeError):
        return None
    return User.objects.filter(id=user_id, is_active=True).first()


class JwtQueryAuthMiddleware:
    """Authenticate websocket upgrades with the existing JWT access token."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query = parse_qs(scope.get("query_string", b"").decode())
        token = query.get("token", [None])[0]
        user = await get_user(token) if token else None
        scope["user"] = user
        return await self.app(scope, receive, send)
