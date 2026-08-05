import { useMemo, useState } from "react";
import {
    Search,
    Copy,
    Mail,
    Trash2,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import DeleteInvitationModal from "./DeleteInvitationModal";

function InvitationsTable({
    invitations = [],
    refreshInvitations,
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

    const roleBadgeClass = (role) => {
        const roleGroup = {
            SUB_ADMIN: "admin",
            "Organization Admin": "admin",
            USER: "employee",
            Employee: "employee",
            SUPER_ADMIN: "super",
            "Super Admin": "super",
        }[role];

        if (roleGroup === "employee") {
            return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 ring-1 ring-emerald-200/70";
        }

        if (roleGroup === "super") {
            return "bg-gradient-to-r from-indigo-50 to-indigo-100/70 text-indigo-700 ring-1 ring-indigo-200/70";
        }

        return "bg-gradient-to-r from-blue-50 to-blue-100/70 text-blue-700 ring-1 ring-blue-200/70";
    };

    const [search, setSearch] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedInvitation, setSelectedInvitation] =
        useState(null);

    const filteredInvitations = useMemo(() => {
        const query = search.toLowerCase();

        return invitations.filter((invite) => {
            return (
                String(invite.organization || "")
                    .toLowerCase()
                    .includes(query) ||
                String(invite.email || "")
                    .toLowerCase()
                    .includes(query) ||
                String(invite.invite_code || "")
                    .toLowerCase()
                    .includes(query) ||
                String(invite.role || "")
                    .toLowerCase()
                    .includes(query)
            );
        });
    }, [invitations, search]);

    const copyInviteCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            alert(
                t(
                    "invite_code_copied",
                    "Invite code copied."
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleResendInvitation = async () => {
        alert(
            t(
                "resend_invitation_coming_soon",
                "Resend invitation feature coming soon."
            )
        );
    };

    return (
        <>
            <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300">
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-100">
                    <div className="relative w-full sm:w-96">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500"
                            size={18}
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder={t(
                                "search_invitation",
                                "Search invitation..."
                            )}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-300 hover:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                        />
                    </div>
                </div>

                {filteredInvitations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-300 ring-1 ring-blue-100 mb-4">
                            <Mail size={28} strokeWidth={1.5} />
                        </div>

                        <p className="text-base font-semibold text-slate-600">
                            {t(
                                "no_invitations_found",
                                "No invitations found."
                            )}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop / tablet table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 border-b border-slate-200">
                                        <th className="p-5">
                                            {t(
                                                "organization",
                                                "Organization"
                                            )}
                                        </th>

                                        <th className="p-5">
                                            {t(
                                                "invite_code",
                                                "Invite Code"
                                            )}
                                        </th>

                                        <th className="p-5">
                                            {t(
                                                "role",
                                                "Role"
                                            )}
                                        </th>

                                        <th className="p-5">
                                            {t(
                                                "status",
                                                "Status"
                                            )}
                                        </th>

                                        <th className="p-5 text-center">
                                            {t(
                                                "actions",
                                                "Actions"
                                            )}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredInvitations.map(
                                        (invite, index) => (
                                            <tr
                                                key={invite.id}
                                                className={`border-b border-slate-100 last:border-none hover:bg-blue-50/50 transition-all duration-300 ${
                                                    index % 2 === 1
                                                        ? "bg-slate-50/40"
                                                        : ""
                                                }`}
                                            >
                                                <td className="p-5">
                                                    <div className="font-semibold text-slate-900">
                                                        {invite.organization}
                                                    </div>

                                                    <div className="text-sm text-slate-500 mt-1">
                                                        {invite.email}
                                                    </div>
                                                </td>

                                                <td className="p-5">
                                                    <code className="inline-flex items-center bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-xl text-sm font-semibold font-mono text-blue-700 tracking-wide">
                                                        {invite.invite_code}
                                                    </code>
                                                </td>

                                                <td className="p-5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${roleBadgeClass(
                                                            invite.role
                                                        )}`}
                                                    >
                                                        {translateRole(invite.role)}
                                                    </span>
                                                </td>

                                                <td className="p-5">
                                                    {invite.status === "Pending" && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs font-semibold shadow-sm ring-1 ring-amber-200/70">
                                                            {t(
                                                                "pending",
                                                                "Pending"
                                                            )}
                                                        </span>
                                                    )}

                                                    {invite.status === "Accepted" && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-700 text-xs font-semibold shadow-sm ring-1 ring-emerald-200/70">
                                                            {t(
                                                                "accepted",
                                                                "Accepted"
                                                            )}
                                                        </span>
                                                    )}

                                                    {invite.status === "Expired" && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-rose-50 text-red-700 text-xs font-semibold shadow-sm ring-1 ring-red-200/70">
                                                            {t(
                                                                "expired",
                                                                "Expired"
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-5">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                copyInviteCode(
                                                                    invite.invite_code
                                                                )
                                                            }
                                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                                        >
                                                            <Copy size={17} />
                                                            {t(
                                                                "copy",
                                                                "Copy"
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleResendInvitation()
                                                            }
                                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 shadow-sm transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                                        >
                                                            <Mail size={17} />
                                                            {t(
                                                                "mail",
                                                                "Mail"
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setSelectedInvitation(invite);
                                                                setDeleteOpen(true);
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 shadow-sm transition-all duration-300 hover:bg-red-100 hover:text-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                                        >
                                                            <Trash2 size={17} />
                                                            {t(
                                                                "delete",
                                                                "Delete"
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile stacked cards */}
                        <div className="md:hidden p-4 space-y-3">
                            {filteredInvitations.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-slate-900 truncate">
                                                {invite.organization}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-0.5 truncate">
                                                {invite.email}
                                            </p>
                                        </div>

                                        <div>
                                            {invite.status === "Pending" && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs font-semibold shadow-sm ring-1 ring-amber-200/70">
                                                    {t(
                                                        "pending",
                                                        "Pending"
                                                    )}
                                                </span>
                                            )}

                                            {invite.status === "Accepted" && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-700 text-xs font-semibold shadow-sm ring-1 ring-emerald-200/70">
                                                    {t(
                                                        "accepted",
                                                        "Accepted"
                                                    )}
                                                </span>
                                            )}

                                            {invite.status === "Expired" && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-rose-50 text-red-700 text-xs font-semibold shadow-sm ring-1 ring-red-200/70">
                                                    {t(
                                                        "expired",
                                                        "Expired"
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <code className="inline-flex items-center bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-xl text-sm font-semibold font-mono text-blue-700 tracking-wide">
                                            {invite.invite_code}
                                        </code>

                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${roleBadgeClass(
                                                invite.role
                                            )}`}
                                        >
                                            {translateRole(invite.role)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() =>
                                                copyInviteCode(
                                                    invite.invite_code
                                                )
                                            }
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Copy size={16} />
                                            {t(
                                                "copy",
                                                "Copy"
                                            )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleResendInvitation()
                                            }
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium bg-emerald-50 text-emerald-600 shadow-sm transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Mail size={16} />
                                            {t(
                                                "mail",
                                                "Mail"
                                            )}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedInvitation(invite);
                                                setDeleteOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium bg-red-50 text-red-600 shadow-sm transition-all duration-300 hover:bg-red-100 hover:text-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Trash2 size={16} />
                                            {t(
                                                "delete",
                                                "Delete"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex justify-center sm:justify-between items-center p-5 border-t border-slate-100">
                    <p className="text-sm text-slate-500 text-center sm:text-left">
                        {t(
                            "showing_of_invitations",
                            "Showing {filtered} of {total} invitations"
                        )
                            .replace(
                                "{filtered}",
                                filteredInvitations.length
                            )
                            .replace(
                                "{total}",
                                invitations.length
                            )}
                    </p>
                </div>
            </div>

            <DeleteInvitationModal
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    refreshInvitations();
                }}
                invitation={selectedInvitation}
            />
        </>
    );
}

export default InvitationsTable;