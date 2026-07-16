from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from users.models import UserAnalytics
from .models import Notification


def create_break_notification(user):
    return Notification.objects.create(
        user=user,
        notification_type="BREAK",
        title="Time to Take a Break",
        message=(
            "You have been working continuously. "
            "Take a short break to stay productive."
        ),
    )


def create_overwork_notification(user):
    return Notification.objects.create(
        user=user,
        notification_type="OVERWORK",
        title="Overwork Alert",
        message=(
            "You have exceeded your recommended work time. "
            "Please consider taking some rest."
        ),
    )


def create_productivity_notification(user):
    return Notification.objects.create(
        user=user,
        notification_type="PRODUCTIVITY",
        title="Great Job!",
        message=(
            "Your productivity today is excellent. "
            "Keep up the good work!"
        ),
    )


def check_break_notifications():
    threshold = timedelta(
        hours=settings.BREAK_REMINDER_HOURS
    )

    for analytics in UserAnalytics.objects.all():
        if analytics.productive_time >= threshold:
            today = timezone.now().date()

            already_exists = Notification.objects.filter(
            user=analytics.user,
             notification_type="BREAK",
            is_read=False,
            ) .exists()

            if not already_exists:
                create_break_notification(
                    analytics.user
                )
                print(
                    f"🔔 Break notification created for {analytics.user.username}"
                )
            else:
                print(
                    f"ℹ️ Break notification already exists for {analytics.user.username}"
                )
        else:
            print(
                f"⌛ {analytics.user.username} has not reached the break reminder threshold yet."
            )