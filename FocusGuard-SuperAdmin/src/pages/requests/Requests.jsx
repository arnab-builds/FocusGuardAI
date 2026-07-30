import AdminLayout from "../../components/layout/AdminLayout";
import RequestsTable from "../../components/requests/RequestsTable";

import { useLanguage } from "../../context/useLanguage";

function Requests() {
    const { t } = useLanguage();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t(
                            "deactivation_requests",
                            "Deactivation Requests"
                        )}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {t(
                            "approve_reject_organization_requests",
                            "Approve or reject organization requests."
                        )}
                    </p>
                </div>

                <RequestsTable />
            </div>
        </AdminLayout>
    );
}

export default Requests;