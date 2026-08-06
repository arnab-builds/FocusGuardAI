import { CheckCircle2, Clock3, Mail, UsersRound, XCircle } from "lucide-react";

const statusStyles = {
    Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
};

const getInvitationStatus = (invitation) =>
    invitation.status || (invitation.is_accepted ? "Accepted" : "Pending");

const StatusIcon = ({ status }) => {
    if (status === "Accepted") return <CheckCircle2 size={16} />;
    if (status === "Rejected") return <XCircle size={16} />;
    return <Clock3 size={16} />;
};

function InvitationList({ invitations, loading }) {
    return (
        <section className="flex min-h-[360px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg lg:max-h-[calc(100vh-15rem)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <UsersRound size={21} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Invited Employees</h2>
                        <p className="text-sm text-slate-500">{invitations.length} total invitation{invitations.length === 1 ? "" : "s"}</p>
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                {loading ? (
                    <p className="px-3 py-8 text-center text-sm text-slate-500">Loading invitations...</p>
                ) : invitations.length === 0 ? (
                    <div className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
                        <Mail size={28} className="mb-3 text-slate-300" />
                        <p className="font-semibold text-slate-700">No invitations yet</p>
                        <p className="mt-1 text-sm text-slate-500">Invited employees will appear here.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {invitations.map((invitation) => {
                            const status = getInvitationStatus(invitation);
                            return (
                                <li key={invitation.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm"><Mail size={18} /></div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">{invitation.username || "Pending registration"}</p>
                                                <p className="mt-0.5 truncate text-xs text-slate-600">{invitation.email}</p>
                                                <p className="mt-1 text-xs text-slate-500">Sent {new Date(invitation.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status] || statusStyles.Pending}`}><StatusIcon status={status} />{status}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default InvitationList;
