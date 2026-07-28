from django.urls import path

from .views import (
    ChatbotAPIView,
    OrganizationAdminChatbotAPIView,
)


urlpatterns = [
    path(
        "chat/",
        ChatbotAPIView.as_view(),
        name="chatbot",
    ),
    path(
        "organization-admin/chat/",
        OrganizationAdminChatbotAPIView.as_view(),
        name="organization-admin-chatbot",
    ),
]
