import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import InviteEmployeeForm from "../components/employees/InviteEmployeeForm";

import { useLanguage } from "../context/useLanguage";

function InviteEmployee() {
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <PageHeader
                    title={t(
                        "invite_employee",
                        "Invite Employee"
                    )}
                    subtitle={t(
                        "invite_employee_subtitle",
                        "Send an invitation to add a new employee to your organization."
                    )}
                />

                <InviteEmployeeForm />
            </div>
        </DashboardLayout>
    );
}

export default InviteEmployee;