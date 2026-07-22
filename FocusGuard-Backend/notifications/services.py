import random

from .models import Notification

NOTIFICATION_MESSAGES = {
    "IDLE": [
        {
            "title": "Back to Work",
            "message": "You've been idle for a while. Let's continue where you left off.",
        },
        {
            "title": "Time to Focus",
            "message": "Your work is waiting. Let's get back to being productive.",
        },
    ],

    "NON_PRODUCTIVE": [
        {
            "title": "Stay Focused",
            "message": "You've reached your non-productive browsing limit. Time to get back to work.",
        },
        {
            "title": "Back on Track",
            "message": "Let's switch back to productive work and keep your momentum going.",
        },
    ],

    "PRODUCTIVE_SESSION": [
        {
            "title": "Great Work!",
            "message": "You've been working productively for a long session. Consider taking a short break.",
        },
        {
            "title": "Excellent Progress",
            "message": "You've maintained great focus. A short break can help you stay refreshed.",
        },
    ],
}


def generate_notification(user, event):
    """
    Create a notification for a user based on the event type.
    """

    notification_data = NOTIFICATION_MESSAGES.get(event)

    if notification_data is None:
        raise ValueError(f"Unsupported notification event: {event}")

    selected = random.choice(notification_data)

    notification = Notification.objects.create(
        user=user,
        notification_type=event,
        title=selected["title"],
        message=selected["message"],
    )

    print(f"🔥 Notification Created [{event}] for {user.username}")

    return notification