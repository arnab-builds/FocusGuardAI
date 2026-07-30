import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
                <div className="p-10 text-center">
                    {t(
                        "loading",
                        "Loading..."
                    )}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <OrganizationOverview
                    organization={organization.organization}
                    summary={organization.summary}
                />

                <EmployeesTable
                    employees={organization.employees_data}
                />
            </div>
        </AdminLayout>
    );
}

export default OrganizationDetails;