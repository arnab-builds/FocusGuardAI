import { useLanguage } from "../../context/useLanguage";

import StatusBadge from "../ui/StatusBadge";

function PendingInvitations({
    invitations = [],
}) {
    const { t } = useLanguage();
    const translateRole = (role) => {
        const roleKey = {
            SUB_ADMIN: "organization_admin",
            "Organization Admin": "organization_admin",
            USER: "employee",
            Employee: "employee",
            SUPER_ADMIN: "super_admin",
            "Super Admin": "super_admin",
        }[role];

        return roleKey ? t(roleKey, role) : role;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    {t(
                        "pending_invitations",
                        "Pending Invitations"
                    )}
                </h2>

                <button className="text-blue-600 font-semibold hover:underline">
                    {t(
                        "view_all",
                        "View All"
                    )}
                </button>
            </div>

            <div className="space-y-5">
                {invitations.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        {t(
                            "no_pending_invitations",
                            "No pending invitations."
                        )}
                    </div>
                ) : (
                    invitations.map((invite) => (
                        <div
                            key={invite.id}
                            className="flex items-center justify-between pb-5 border-b last:border-none"
                        >
                            <div>
                                <h3 className="font-semibold">
                                    {invite.email}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {invite.organization}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {translateRole(invite.role)}
                                </p>
                            </div>

                            <StatusBadge
                                status={
                                    invite.status ||
                                    t(
                                        "pending",
                                        "Pending"
                                    )
                                }
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PendingInvitations;
