from .models import Recommendation
from users.models import UserAnalytics


def generate_recommendations(user):
    # Remove old recommendations
    Recommendation.objects.filter(user=user).delete()

    analytics = UserAnalytics.objects.filter(user=user).first()

    if not analytics:
        return

    productive = analytics.productive_time.total_seconds()
    non_productive = analytics.non_productive_time.total_seconds()

    total = productive + non_productive

    if total > 0:
        productivity_percentage = (productive / total) * 100
    else:
        productivity_percentage = 0

    # High productivity
    if productivity_percentage >= 90:
        Recommendation.objects.create(
            user=user,
            recommendation_type="PRODUCTIVITY",
            title="Excellent Productivity!",
            message="Great job! Your productivity is above 90%. Keep it up!",
        )

    # Low productivity
    elif productivity_percentage < 60:
        Recommendation.objects.create(
            user=user,
            recommendation_type="FOCUS",
            title="Improve Your Focus",
            message="Your productivity is below 60%. Try reducing distractions.",
        )

    # Break reminder
    if productive >= 3 * 60 * 60:
        Recommendation.objects.create(
            user=user,
            recommendation_type="BREAK",
            title="Take a Break",
            message="You've been working continuously for a long time. Take a short break.",
        )