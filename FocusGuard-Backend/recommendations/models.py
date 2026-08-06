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

    recommendation_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "recommendation_date"],
                name="unique_recommendation_per_user_date",
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title}"
