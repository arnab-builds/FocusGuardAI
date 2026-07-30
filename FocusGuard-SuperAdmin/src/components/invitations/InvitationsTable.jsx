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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="relative w-96">
                        <Search
                            className="absolute left-3 top-3 text-gray-400"
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
                            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                            <th className="p-5">
                                {t(
                                    "organization",
                                    "Organization"
                                )}
                            </th>

                            <th>
                                {t(
                                    "invite_code",
                                    "Invite Code"
                                )}
                            </th>

                            <th>
                                {t(
                                    "role",
                                    "Role"
                                )}
                            </th>

                            <th>
                                {t(
                                    "status",
                                    "Status"
                                )}
                            </th>

                            <th className="text-center">
                                {t(
                                    "actions",
                                    "Actions"
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredInvitations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-12 text-center text-gray-500"
                                >
                                    {t(
                                        "no_invitations_found",
                                        "No invitations found."
                                    )}
                                </td>
                            </tr>
                        ) : (
                            filteredInvitations.map((invite) => (
                                <tr
                                    key={invite.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-5">
                                        <div className="font-semibold text-gray-900">
                                            {invite.organization}
                                        </div>

                                        <div className="text-sm text-gray-500 mt-1">
                                            {invite.email}
                                        </div>
                                    </td>

                                    <td>
                                        <code className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-semibold">
                                            {invite.invite_code}
                                        </code>
                                    </td>

                                    <td className="font-medium">
                                        {translateRole(invite.role)}
                                    </td>

                                    <td>
                                        {invite.status === "Pending" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                                {t(
                                                    "pending",
                                                    "Pending"
                                                )}
                                            </span>
                                        )}

                                        {invite.status === "Accepted" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                                {t(
                                                    "accepted",
                                                    "Accepted"
                                                )}
                                            </span>
                                        )}

                                        {invite.status === "Expired" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                                                {t(
                                                    "expired",
                                                    "Expired"
                                                )}
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() =>
                                                    copyInviteCode(
                                                        invite.invite_code
                                                    )
                                                }
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
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
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition"
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
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition"
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
                            ))
                        )}
                    </tbody>
                </table>

                <div className="flex justify-between items-center p-5 border-t">
                    <p className="text-gray-500">
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
