from django.conf import settings
from django.db import models


class UserSettings(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="settings",
    )

    productive_threshold = models.PositiveIntegerField(default=60)

    non_productive_threshold = models.PositiveIntegerField(default=10)

    idle_threshold = models.PositiveIntegerField(default=5)

    browser_notifications = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Settings"