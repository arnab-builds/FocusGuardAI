"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Initialize Django's app registry before importing websocket modules. JWT
# authentication imports Django's user model transitively.
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from users.consumers import RealtimeConsumer
from users.websocket_auth import JwtQueryAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(JwtQueryAuthMiddleware(
        URLRouter([path("ws/realtime/", RealtimeConsumer.as_asgi())])
    )),
})
