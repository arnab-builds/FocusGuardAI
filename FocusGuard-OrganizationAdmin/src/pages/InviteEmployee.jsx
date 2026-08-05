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
        "employee_onboarding",
        "Employee Onboarding"
    )}
    subtitle={t(
        "employee_onboarding_subtitle",
        "Invite new employees to join your organization and start monitoring productivity."
    )}
/>

                <InviteEmployeeForm />
            </div>
        </DashboardLayout>
    );
}

export default InviteEmployee;