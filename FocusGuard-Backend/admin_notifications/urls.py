from django.urls import path

from .views import (
    AdminNotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)

urlpatterns = [

    path(
        "",
        AdminNotificationListView.as_view(),
        name="admin-notifications",
    ),

    path(
        "<int:pk>/read/",
        MarkNotificationReadView.as_view(),
        name="mark-admin-notification-read",
    ),

    path(
        "read-all/",
        MarkAllNotificationsReadView.as_view(),
        name="mark-all-admin-notifications-read",
    ),

]