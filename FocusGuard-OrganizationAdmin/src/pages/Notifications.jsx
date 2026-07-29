import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import NotificationList from "../components/notifications/NotificationList";

import { useLanguage } from "../context/useLanguage";

function Notifications() {
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <PageHeader
                    title={t(
                        "notifications",
                        "Notifications"
                    )}
                    subtitle={t(
                        "view_all_system_notifications",
                        "View all system notifications"
                    )}
                />

                <NotificationList />
            </div>
        </DashboardLayout>
    );
}

export default Notifications;