import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import InviteEmployeeForm from "../components/employees/InviteEmployeeForm";

function InviteEmployee() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <PageHeader
                    title="Invite Employee"
                    subtitle="Send an invitation to add a new employee to your organization."
                />

                <InviteEmployeeForm />

            </div>

        </DashboardLayout>

    );

}

export default InviteEmployee;