from collections import defaultdict
import traceback

from .models import Recommendation
from users.models import ActivityLog

from llm.manager import LLMManager
from llm.prompts import SYSTEM_PROMPT


def generate_ai_recommendation(user, analytics):
    """
    Generate AI-powered productivity recommendation.
    """

    print("\n==============================")
    print(f"🚀 Starting recommendation for: {user.username}")
    print("==============================")

    manager = LLMManager()

    productive = analytics.productive_time.total_seconds() / 60
    non_productive = analytics.non_productive_time.total_seconds() / 60
    idle = analytics.idle_time.total_seconds() / 60

    activities = ActivityLog.objects.filter(user=user)

    category_summary = defaultdict(int)
    website_summary = defaultdict(lambda: {"time": 0, "visits": 0})

    for activity in activities:

        if not activity.duration:
            continue

        minutes = round(activity.duration.total_seconds() / 60)

        category = activity.category or "Other"
        website = activity.website_name or "Unknown"

        category_summary[category] += minutes

        website_summary[website]["time"] += minutes
        website_summary[website]["visits"] += 1

    category_text = ""

    for category, minutes in category_summary.items():
        category_text += f"- {category}: {minutes} minutes\n"

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
{analytics.websites_visited}

Tab Switches:
{analytics.tab_switches}

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
        print("✅ STEP 1 - Calling Gemini...")

        response = manager.generate(
            SYSTEM_PROMPT,
            prompt,
        )

        print("✅ STEP 2 - Gemini Response:")
        print(response)

        if not response:
            raise ValueError("Gemini returned an empty response.")

        title = "AI Recommendation"
        message = response.strip()

        if "Title:" in response and "Message:" in response:

            parts = response.split("Message:", 1)

            title = (
                parts[0]
                .replace("Title:", "")
                .strip()
            )

            message = parts[1].strip()

        print("✅ STEP 3 - Parsed Response")
        print("Title:", title)
        print("Message:", message)

        Recommendation.objects.filter(user=user).delete()

        print("✅ STEP 4 - Old recommendation deleted")

        recommendation = Recommendation.objects.create(
            user=user,
            recommendation_type="PRODUCTIVITY",
            title=title,
            message=message,
        )

        print("✅ STEP 5 - Recommendation Saved")
        print("Recommendation ID:", recommendation.id)
        print("Recommendation Count:", Recommendation.objects.count())

        return recommendation

    except Exception:
        print("\n❌ ERROR INSIDE generate_ai_recommendation()")
        traceback.print_exc()
        raise