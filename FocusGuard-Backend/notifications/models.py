from django.conf import settings
from django.db import models


class Notification(models.Model):

    NOTIFICATION_TYPES = [

        ("BREAK", "Break Reminder"),

        ("OVERWORK", "Overwork Alert"),

        ("PRODUCTIVITY", "Productivity Alert"),

    ]

    user = models.ForeignKey(

        settings.AUTH_USER_MODEL,

        on_delete=models.CASCADE,

        related_name="notifications"

    )

    notification_type = models.CharField(

        max_length=20,

        choices=NOTIFICATION_TYPES

    )

    title = models.CharField(

        max_length=255

    )

    message = models.TextField()

    is_read = models.BooleanField(

        default=False

    )

    created_at = models.DateTimeField(

        auto_now_add=True

    )

    def __str__(self):

        return f"{self.user.username} - {self.notification_type}"