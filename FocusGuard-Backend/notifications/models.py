from django.conf import settings
from django.db import models


class Notification(models.Model):

    NOTIFICATION_TYPES = [
        ("BREAK", "Break Reminder"),
        ("OVERWORK", "Overwork Alert"),
        ("PRODUCTIVITY", "Productivity Alert"),

        # New notification types
        ("IDLE", "Idle Too Long"),
        ("NON_PRODUCTIVE", "Non Productive Limit"),
        ("PRODUCTIVE_SESSION", "Productive Work Session"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPES,
    )

    title = models.CharField(
        max_length=255,
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False,
    )

    # NEW: Prevent duplicate notifications
    last_triggered_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.notification_type}"