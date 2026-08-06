import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loader2 } from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import OrganizationOverview from "../../components/organizations/OrganizationOverview";
import EmployeesTable from "../../components/organizations/EmployeesTable";

import { useLanguage } from "../../context/useLanguage";

import { getOrganization } from "../../services/superAdminService";

function OrganizationDetails() {
    const { t } = useLanguage();

    const { id } = useParams();

    const [organization, setOrganization] = useState(null);

    const loadOrganization = async () => {
        try {
            const res = await getOrganization(id);

            setOrganization(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadOrganization();
    }, [id]);

    if (!organization) {
        return (
            <AdminLayout>
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-100 bg-white p-12 sm:p-16 shadow-sm">
                        <Loader2
                            size={32}
                            className="animate-spin text-blue-600"
                            strokeWidth={2}
                        />

                        <p className="text-sm sm:text-base font-medium text-slate-500">
                            {t(
                                "loading",
                                "Loading..."
                            )}
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto">
                <div className="rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 lg:p-7">
                    <OrganizationOverview
                        organization={organization.organization}
                        summary={organization.summary}
                    />
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="p-4 sm:p-6 lg:p-7">
                        <EmployeesTable
                            employees={organization.employees_data}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default OrganizationDetails;