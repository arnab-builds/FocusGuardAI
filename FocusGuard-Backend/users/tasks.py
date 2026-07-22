from datetime import timedelta
import traceback

from celery import shared_task
from django.contrib.auth import get_user_model

from recommendations.services import generate_ai_recommendation

from .models import (
    ActivityLog,
    UserAnalytics,
    UserInactivity,
)

User = get_user_model()


@shared_task
def test_task():
    print("🚀 Celery is Working!")
    return "Success"


@shared_task
def generate_user_analytics():
    """
    Runs every minute.

    - Calculates productive time
    - Calculates non-productive time
    - Calculates idle time
    - Counts unique websites visited
    - Counts tab switches
    - Updates UserAnalytics
    """

    for user in User.objects.all():

        productive_time = timedelta()
        non_productive_time = timedelta()
        neutral_time = timedelta()
        idle_time = timedelta()

        activities = (
            ActivityLog.objects
            .filter(user=user)
            .order_by("start_time")
        )

        unique_websites = {
            activity.website_url or activity.website_name
            for activity in activities
        }

        websites = len(unique_websites)
        activity_count = activities.count()
        tab_switches = max(activity_count - 1, 0)

        for activity in activities:

            if not activity.duration:
                continue

            if activity.productivity_type == "PRODUCTIVE":
                productive_time += activity.duration
            elif activity.productivity_type == "NON_PRODUCTIVE":
                non_productive_time += activity.duration
            else:
                neutral_time += activity.duration

        inactivity_logs = UserInactivity.objects.filter(user=user)

        for log in inactivity_logs:

            if log.duration:
                idle_time += log.duration

        UserAnalytics.objects.update_or_create(
            user=user,
            defaults={
                "productive_time": productive_time,
                "non_productive_time": non_productive_time,
                "neutral_time": neutral_time,
                "idle_time": idle_time,
                "websites_visited": websites,
                "tab_switches": tab_switches,
            },
        )

    print("✅ Analytics Updated Successfully")


@shared_task
def generate_ai_recommendations():
    """
    Runs every 5 minutes in the current testing schedule.

    Generates AI recommendations
    using the latest analytics.
    """

    analytics_list = UserAnalytics.objects.select_related("user")

    for analytics in analytics_list:

        try:
            recommendation = generate_ai_recommendation(
                analytics.user,
                analytics.generated_at.date(),
                analytics.generated_at.date(),
            )

            print(
                "✅ AI Recommendation "
                f"{recommendation.id} generated for {analytics.user.username}"
            )

        except Exception:

            print(f"\n❌ Gemini failed for {analytics.user.username}")
            traceback.print_exc()

    print("🤖 AI Recommendations Generated Successfully")