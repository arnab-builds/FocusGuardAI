from django.conf import settings
from django.db import models


class Notification(models.Model):

    class NotificationType(models.TextChoices):
        IDLE = "IDLE", "Idle Too Long"
        NON_PRODUCTIVE = "NON_PRODUCTIVE", "Non Productive Limit"
        PRODUCTIVE_SESSION = "PRODUCTIVE_SESSION", "Productive Work Session"
        INVITATION = "INVITATION", "Invitation"
        REQUEST = "REQUEST", "Request"
        SYSTEM = "SYSTEM", "System"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
    )

    title = models.CharField(
        max_length=255,
    )

    message = models.TextField()

    is_read = models.BooleanField(
        default=False,
    )

    last_triggered_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.get_notification_type_display()}"
        )
