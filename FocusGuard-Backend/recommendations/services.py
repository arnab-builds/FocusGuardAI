from collections import defaultdict
from datetime import timedelta
import traceback

from users.models import ActivityLog, UserInactivity

from llm.manager import LLMManager
from llm.prompts import SYSTEM_PROMPT

from .models import Recommendation


PRODUCTIVE_CATEGORIES = {
    "Development",
    "Coding Practice",
    "Education",
    "Learning",
    "Documentation",
    "Professional Networking",
    "AI Tools",
}


def calculate_analytics(user, start_date, end_date):
    productive_time = timedelta()
    non_productive_time = timedelta()
    idle_time = timedelta()

    activities = ActivityLog.objects.filter(
        user=user,
        start_time__date__range=[start_date, end_date],
    ).order_by("start_time")

    unique_websites = {
        activity.website_url or activity.website_name
        for activity in activities
    }

    for activity in activities:

        if not activity.duration:
            continue

        if activity.category in PRODUCTIVE_CATEGORIES:
            productive_time += activity.duration
        else:
            non_productive_time += activity.duration

    inactivity_logs = UserInactivity.objects.filter(
    user=user,
    inactive_from__date__range=[start_date, end_date],
     )

    for log in inactivity_logs:

        if log.duration:
            idle_time += log.duration

    return {
        "productive_time": productive_time,
        "non_productive_time": non_productive_time,
        "idle_time": idle_time,
        "websites_visited": len(unique_websites),
        "tab_switches": max(activities.count() - 1, 0),
        "activities": activities,
    }


def generate_ai_recommendation(user, start_date, end_date):
    """
    Generate AI-powered productivity recommendation
    for the selected date range.
    """

    print("\n==============================")
    print(f"🚀 Starting recommendation for: {user.username}")
    print("==============================")

    manager = LLMManager()

    analytics = calculate_analytics(
        user,
        start_date,
        end_date,
    )

    productive = (
        analytics["productive_time"].total_seconds() / 60
    )

    non_productive = (
        analytics["non_productive_time"].total_seconds() / 60
    )

    idle = (
        analytics["idle_time"].total_seconds() / 60
    )

    activities = analytics["activities"]
    # Add this block here
    if not activities.exists():
     Recommendation.objects.filter(user=user).delete()

     return Recommendation.objects.create(
        user=user,
        recommendation_type="PRODUCTIVITY",
        title="No Activity Found",
        message="No browsing activity was found for the selected date range.",
    )

    category_summary = defaultdict(int)
    website_summary = defaultdict(
        lambda: {
            "time": 0,
            "visits": 0,
        }
    )

    for activity in activities:

        if not activity.duration:
            continue

        minutes = round(
            activity.duration.total_seconds() / 60
        )

        category = activity.category or "Other"
        website = activity.website_name or "Unknown"

        category_summary[category] += minutes

        website_summary[website]["time"] += minutes
        website_summary[website]["visits"] += 1

    category_text = ""

    for category, minutes in category_summary.items():
        category_text += (
            f"- {category}: {minutes} minutes\n"
        )

    website_text = ""

    for website, details in website_summary.items():
        website_text += (
            f"- {website}: "
            f"{details['time']} minutes "
            f"({details['visits']} visits)\n"
        )

    prompt = f"""
You are an expert AI productivity coach.

Analyze the user's browsing behaviour.

Productive Time:
{productive:.0f} minutes

Non Productive Time:
{non_productive:.0f} minutes

Idle Time:
{idle:.0f} minutes

Websites Visited:
{analytics["websites_visited"]}

Tab Switches:
{analytics["tab_switches"]}

Category Summary:
{category_text if category_text else "No category data"}

Website Summary:
{website_text if website_text else "No website data"}

Instructions:

1. Give ONLY ONE personalized recommendation.
2. Mention both strengths and improvements if applicable.
3. Be encouraging.
4. Keep the response under 80 words.
5. Use this exact format:

Title:
Message:
"""

    try:

        response = manager.generate(
            SYSTEM_PROMPT,
            prompt,
        )

        if not response:
            raise ValueError(
                "LLM returned an empty response."
            )

        title = "AI Recommendation"
        message = response.strip()

        if (
            "Title:" in response
            and "Message:" in response
        ):

            parts = response.split(
                "Message:",
                1,
            )

            title = (
                parts[0]
                .replace("Title:", "")
                .strip()
            )

            message = parts[1].strip()

        Recommendation.objects.filter(
            user=user
        ).delete()

        recommendation = Recommendation.objects.create(
            user=user,
            recommendation_type="PRODUCTIVITY",
            title=title,
            message=message,
        )

        return recommendation

    except Exception:
        traceback.print_exc()
        raise