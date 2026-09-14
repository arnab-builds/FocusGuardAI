import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import InviteEmployeeForm from "../components/employees/InviteEmployeeForm";
import InvitationList from "../components/employees/InvitationList";
import { getInvitations } from "../services/employeeService";

import { useLanguage } from "../context/useLanguage";

function InviteEmployee() {
    const { t } = useLanguage();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInvitations = async () => {
            try {
                setInvitations(await getInvitations());
            } catch (error) {
                console.error("Invitations could not be loaded:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInvitations();
    }, []);

    return (
            <div className="space-y-6">
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

                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                    <InviteEmployeeForm onInvitationSent={(invitation) => setInvitations((current) => [invitation, ...current])} />
                    <InvitationList invitations={invitations} loading={loading} />
                </div>
            </div>
    );
}

export default InviteEmployee;
