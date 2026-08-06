from django.conf import settings
from django.db import models


class ChatMessage(models.Model):
    SENDER_CHOICES = [("user", "User"), ("ai", "AI")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_messages")
    selected_date = models.DateField()
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at", "id"]
        indexes = [
            models.Index(
                fields=["user", "selected_date"],
                name="chatbot_cha_user_id_6bb904_idx",
            )
        ]
