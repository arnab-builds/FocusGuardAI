from celery import shared_task
from notifications.services import check_break_notifications
from recommendations.services import generate_recommendations


@shared_task
def test_task():

    print("🚀 Celery is Working!")

    return "Success"
from datetime import timedelta

from django.contrib.auth import get_user_model

from .models import (
    ActivityLog,
    UserAnalytics,
    UserInactivity,
)

User = get_user_model()


PRODUCTIVE_CATEGORIES = {
    "Development",
    "Coding Practice",
    "Education",
    "Documentation",
    "Professional Networking",
    "AI Tools",
}


@shared_task
def generate_user_analytics():

    for user in User.objects.all():

        productive_time = timedelta()

        non_productive_time = timedelta()

        idle_time = timedelta()

        websites = 0

        tab_switches = 0

        activities = ActivityLog.objects.filter(user=user)

        websites = activities.count()

        if websites > 0:
            tab_switches = websites - 1

        for activity in activities:

            if not activity.duration:
                continue

            if activity.category in PRODUCTIVE_CATEGORIES:
                productive_time += activity.duration
            else:
                non_productive_time += activity.duration

        inactivity_logs = UserInactivity.objects.filter(user=user)

        for log in inactivity_logs:

            if log.duration:
                idle_time += log.duration

        UserAnalytics.objects.update_or_create(

            user=user,

            defaults={

                "productive_time": productive_time,

                "non_productive_time": non_productive_time,

                "idle_time": idle_time,

                "websites_visited": websites,

                "tab_switches": tab_switches,

            }

        )

    print("✅ Analytics Updated Successfully")

    check_break_notifications()

    print("🔔 Notifications Checked")

    for analytics in UserAnalytics.objects.all():
     generate_recommendations(analytics.user)

    print("💡 Recommendations Generated")