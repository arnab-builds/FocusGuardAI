import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import NotificationList from "../components/notifications/NotificationList";

function Notifications() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <PageHeader
                    title="Notifications"
                    subtitle="View all system notifications"
                />

                <NotificationList />

            </div>

        </DashboardLayout>

    );

}

export default Notifications;