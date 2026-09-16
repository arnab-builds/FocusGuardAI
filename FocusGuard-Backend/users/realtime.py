from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging

from .consumers import SUPERADMIN_GROUP, organization_group, user_group

logger = logging.getLogger(__name__)


def publish(groups, payload):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return
    for group in set(filter(None, groups)):
        try:
            async_to_sync(channel_layer.group_send)(
                group, {"type": "realtime.event", "payload": payload}
            )
        except Exception:
            # REST persistence remains reliable if a Redis deployment is
            # temporarily unavailable; clients reconnect and REST is fallback.
            logger.exception("Realtime publish failed for group %s", group)


def publish_notification(user, notification, event="NOTIFICATION_CREATED"):
    publish([user_group(user.id)], {
        "event": event,
        "notification": {
            "id": notification.id, "notification_type": notification.notification_type,
            "title": notification.title, "message": notification.message,
            "is_read": notification.is_read, "created_at": notification.created_at.isoformat(),
        },
    })


def publish_activity(user, activity, status="ACTIVE"):
    payload = {
        "event": "ACTIVITY_STATUS_CHANGED", "user_id": user.id,
        "organization_id": user.organization_id, "status": status,
        "activity": {
            "id": activity.id if activity else None,
            "website_name": getattr(activity, "website_name", ""),
            "website_url": getattr(activity, "website_url", ""),
            "favicon_url": getattr(activity, "favicon_url", ""),
            "category": getattr(activity, "category", ""),
            "productivity_type": getattr(activity, "productivity_type", "NEUTRAL"),
            "username": getattr(user, "display_username", user.username),
            "start_time": getattr(activity, "start_time", None).isoformat() if activity else None,
        },
    }
    groups = [user_group(user.id), SUPERADMIN_GROUP]
    if user.organization_id:
        groups.append(organization_group(user.organization_id))
    publish(groups, payload)
