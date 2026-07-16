from datetime import timedelta

from django.utils import timezone

from users.models import ActivityLog, UserInactivity


def generate_report(user, days):

    end_date = timezone.now()

    start_date = end_date - timedelta(days=days)

    activities = ActivityLog.objects.filter(
        user=user,
        start_time__gte=start_date,
        start_time__lte=end_date
    )

    productive_time = timedelta()

    non_productive_time = timedelta()

    websites = set()

    tab_switches = activities.count()

    productive_categories = [
        "Development",
        "Coding Practice",
        "Education",
        "Documentation",
        "AI Tools",
    ]

    for activity in activities:

        if activity.duration:

            if activity.category in productive_categories:

                productive_time += activity.duration

            else:

                non_productive_time += activity.duration

        if activity.website_url:

            websites.add(activity.website_url)

    inactivity_logs = UserInactivity.objects.filter(
        user=user,
        inactive_from__gte=start_date,
        inactive_from__lte=end_date
    )

    idle_time = timedelta()

    for inactivity in inactivity_logs:

        if inactivity.duration:

            idle_time += inactivity.duration

    total_time = productive_time + non_productive_time

    productivity_percentage = 0

    if total_time > timedelta():

        productivity_percentage = round(
            (
                productive_time.total_seconds()
                /
                total_time.total_seconds()
            ) * 100,
            2
        )

    return {

        "productive_time": productive_time,

        "non_productive_time": non_productive_time,

        "idle_time": idle_time,

        "websites_visited": len(websites),

        "tab_switches": tab_switches,

        "productivity_percentage": productivity_percentage,

    }