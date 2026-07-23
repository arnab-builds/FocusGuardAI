from datetime import datetime, time, timedelta

from django.utils import timezone

from users.models import ActivityLog, UserInactivity


def generate_report(user, days, selected_date=None):

    if selected_date:
        end_date = timezone.make_aware(
            datetime.combine(selected_date, time.max)
        )

        if days == 1:
            start_date = timezone.make_aware(
                datetime.combine(selected_date, time.min)
            )
        else:
            start_date = end_date - timedelta(days=days - 1)

    else:
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)

    activities = ActivityLog.objects.filter(
        user=user,
        start_time__gte=start_date,
        start_time__lte=end_date,
    )

    productive_time = timedelta()
    non_productive_time = timedelta()
    neutral_time = timedelta()

    websites = set()

    tab_switches = max(activities.count() - 1, 0)

    for activity in activities:

        if activity.duration:

            if activity.productivity_type == "PRODUCTIVE":
                productive_time += activity.duration

            elif activity.productivity_type == "NON_PRODUCTIVE":
                non_productive_time += activity.duration

            else:
                neutral_time += activity.duration

        if activity.website_url:
            websites.add(activity.website_url)

    inactivity_logs = UserInactivity.objects.filter(
        user=user,
        inactive_from__gte=start_date,
        inactive_from__lte=end_date,
    )

    idle_time = timedelta()

    for inactivity in inactivity_logs:

        if inactivity.duration:
            idle_time += inactivity.duration

        elif inactivity.is_active:
            idle_time += timezone.now() - inactivity.inactive_from

    total_time = (
        productive_time +
        non_productive_time +
        neutral_time
    )

    productivity_percentage = 0

    if total_time.total_seconds() > 0:
        productivity_percentage = round(
            productive_time.total_seconds()
            / total_time.total_seconds()
            * 100,
            2,
        )

    return {
        "productive_time": productive_time,
        "non_productive_time": non_productive_time,
        "neutral_time": neutral_time,
        "idle_time": idle_time,
        "websites_visited": len(websites),
        "tab_switches": tab_switches,
        "productivity_percentage": productivity_percentage,
    }