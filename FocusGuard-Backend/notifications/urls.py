from django.urls import path

from .views import (
    GenerateNotificationAPIView,
    NotificationListAPIView,
    MarkNotificationReadAPIView,
     DeleteNotificationAPIView,
)


urlpatterns = [

    path(
        "",
        NotificationListAPIView.as_view(),
        name="notification-list",
    ),

    path(
        "<int:pk>/read/",
        MarkNotificationReadAPIView.as_view(),
        name="notification-read",
    ),

    path(
        "<int:pk>/",
        DeleteNotificationAPIView.as_view(),
        name="notification-delete",
    ),

    path(
        "generate/",
        GenerateNotificationAPIView.as_view(),
        name="notification-generate",
    ),

]