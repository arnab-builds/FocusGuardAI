from django.db import models
from users.models import User


class Recommendation(models.Model):
    RECOMMENDATION_TYPES = [
        ("BREAK", "Break"),
        ("PRODUCTIVITY", "Productivity"),
        ("FOCUS", "Focus"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recommendations"
    )

    recommendation_type = models.CharField(
        max_length=20,
        choices=RECOMMENDATION_TYPES
    )

    title = models.CharField(max_length=255)

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.title}"