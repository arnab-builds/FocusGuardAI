from users.models import User
from .models import AdminNotification
from users.realtime import publish_notification


def create_admin_notification(
    title,
    message,
    notification_type="system",
):

    notifications = AdminNotification.objects.bulk_create(
        [
            AdminNotification(
                user=admin,
                title=title,
                message=message,
                notification_type=notification_type,
            )
            for admin in User.objects.filter(
                role="SUPER_ADMIN",
                is_active=True,
            )
        ]
    )


def organization_created(name, created_by):
    create_admin_notification(
        title="New Organization Created",
        message=f"{name} has been created by {created_by}.",
        notification_type="organization",
    )


def invitation_sent(email, organization):
    create_admin_notification(
        title="Invitation Sent",
        message=f"Invitation sent to {email} for {organization}.",
        notification_type="invitation",
    )


def invitation_accepted(username, organization):
    create_admin_notification(
        title="Invitation Accepted",
        message=f"{username} joined {organization}.",
        notification_type="invitation",
    )


def deactivation_requested(organization):
    create_admin_notification(
        title="Organization Deactivation Request",
        message=f"{organization} requested deactivation.",
        notification_type="request",
    )


def deactivation_approved(organization, approved_by):
    create_admin_notification(
        title="Organization Deactivated",
        message=f"{organization} was deactivated by {approved_by}.",
        notification_type="request",
    )


def deactivation_rejected(organization, rejected_by):
    create_admin_notification(
        title="Deactivation Request Rejected",
        message=f"{organization} request rejected by {rejected_by}.",
        notification_type="request",
    )
    for notification in notifications:
        publish_notification(notification.user, notification)
