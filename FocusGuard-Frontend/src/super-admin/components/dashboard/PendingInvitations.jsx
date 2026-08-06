import { Mail } from "lucide-react";

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
        <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-100 p-5 sm:p-6 lg:p-7 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {t(
                        "pending_invitations",
                        "Pending Invitations"
                    )}
                </h2>

                <button className="self-start sm:self-auto text-sm font-semibold text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300">
                    {t(
                        "view_all",
                        "View All"
                    )}
                </button>
            </div>

            <div className="space-y-2">
                {invitations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
                            <Mail size={28} strokeWidth={1.5} />
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            {t(
                                "no_pending_invitations",
                                "No pending invitations."
                            )}
                        </p>
                    </div>
                ) : (
                    invitations.map((invite) => (
                        <div
                            key={invite.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 p-3 sm:p-4 transition-all duration-300"
                        >
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-slate-900 truncate">
                                    {invite.email}
                                </h3>

                                <p className="text-sm text-slate-500 mt-0.5 truncate">
                                    {invite.organization}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    {translateRole(invite.role)}
                                </p>
                            </div>

                            <div className="shrink-0 sm:pl-4">
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PendingInvitations;