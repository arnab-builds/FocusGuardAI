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
                        "requests",
                        "Requests"
                    )}
                    subtitle={t(
                        "manage_employee_requests",
                        "Manage employee requests"
                    )}
                />

                <RequestTable />
            </div>
        </DashboardLayout>
    );
}

export default Requests;