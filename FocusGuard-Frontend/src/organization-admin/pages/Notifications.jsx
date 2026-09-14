
import PageHeader from "../components/common/PageHeader";
import NotificationList from "../components/notifications/NotificationList";

import { useLanguage } from "../context/useLanguage";

function Notifications() {
    const { t } = useLanguage();

    return (
            <div className="space-y-8">
                <PageHeader
    title={t(
        "notification_center",
        "Notification Center"
    )}
    subtitle={t(
        "notification_center_subtitle",
        "Stay updated with system alerts, employee activities, invitations, approvals, and important organization events."
    )}
/>

                <NotificationList />
            </div>
    );
}

export default Notifications;