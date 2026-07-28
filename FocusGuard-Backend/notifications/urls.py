from django.urls import path

from .views import (
    GenerateNotificationAPIView,
    MarkAllNotificationsReadAPIView,
    NotificationListAPIView,
    MarkNotificationReadAPIView,
    DeleteNotificationAPIView,
    UnreadNotificationCountAPIView,
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
        "read-all/",
        MarkAllNotificationsReadAPIView.as_view(),
        name="notification-read-all",
    ),

    path(
        "unread-count/",
        UnreadNotificationCountAPIView.as_view(),
        name="notification-unread-count",
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
