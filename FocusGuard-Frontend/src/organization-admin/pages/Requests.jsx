import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import RequestTable from "../components/requests/RequestTable";

import { useLanguage } from "../context/useLanguage";

function Requests() {
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <PageHeader
    title={t(
        "request_management",
        "Request Management"
    )}
    subtitle={t(
        "request_management_subtitle",
        "Review employee requests, approve or reject submissions, and manage organization actions from one place."
    )}
/>

                <RequestTable />
            </div>
        </DashboardLayout>
    );
}

export default Requests;