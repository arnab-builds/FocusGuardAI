from django.urls import path

from .views import (
    ChatbotAPIView,
    ChatHistoryAPIView,
    ClearChatHistoryAPIView,
    OrganizationAdminChatbotAPIView,
)


urlpatterns = [
    path(
        "chat/",
        ChatbotAPIView.as_view(),
        name="chatbot",
    ),
    path("history/", ChatHistoryAPIView.as_view(), name="chatbot-history"),
    path("history/clear/", ClearChatHistoryAPIView.as_view(), name="clear-chatbot-history"),
    path(
        "organization-admin/chat/",
        OrganizationAdminChatbotAPIView.as_view(),
        name="organization-admin-chatbot",
    ),
]
