from django.db import models
from django.conf import settings


class FocusGoal(models.Model):

    METRIC_CHOICES = [
        ("Deep Work Session", "Deep Work Session"),
        ("Social Media Limit", "Social Media Limit"),
        ("Daily Focus Score Target", "Daily Focus Score Target"),
        ("Daily Screen Time Limit", "Daily Screen Time Limit"),
        ("Context Switch Limit", "Context Switch Limit"),
        ("Break Frequency Target", "Break Frequency Target"),
        ("No-Distraction Block", "No-Distraction Block"),
    ]

    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    STATUS_CHOICES = [
        ("On Track", "On Track"),
        ("At Risk", "At Risk"),
        ("Completed", "Completed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="focus_goals",
    )

    goal_metric = models.CharField(
        max_length=100,
        choices=METRIC_CHOICES,
    )

    target_value = models.FloatField()

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default="Medium",
    )

    deadline = models.DateField(
        blank=True,
        null=True,
    )

    notes = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="On Track",
    )

    progress = models.FloatField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.goal_metric}"


class FocusPlan(models.Model):
    goal = models.OneToOneField(
        FocusGoal,
        on_delete=models.CASCADE,
        related_name="plan",
    )

    plan = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"Plan for {self.goal.goal_metric}"