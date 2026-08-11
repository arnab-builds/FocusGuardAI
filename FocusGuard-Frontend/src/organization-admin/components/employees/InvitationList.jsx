import { CheckCircle2, Clock3, Mail, UsersRound, XCircle } from "lucide-react";
import { useLanguage } from "../../context/useLanguage";

const statusStyles = {
    Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-900/50",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-900/50",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-900/50",
};

const getInvitationStatus = (invitation) =>
    invitation.status || (invitation.is_accepted ? "Accepted" : "Pending");

const StatusIcon = ({ status }) => {
    if (status === "Accepted") return <CheckCircle2 size={16} />;
    if (status === "Rejected") return <XCircle size={16} />;
    return <Clock3 size={16} />;
};

function InvitationList({ invitations, loading }) {
    const { t } = useLanguage();
    return (
        <section className="flex min-h-[360px] flex-col overflow-hidden rounded-3xl border border-indigo-100/50 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-800 shadow-lg lg:max-h-[calc(100vh-15rem)]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"><UsersRound size={21} /></div>
                    <div><h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("invited_employees")}</h2><p className="text-sm text-slate-500 dark:text-slate-400">{invitations.length} {t("total_invitations", "total invitations")}</p></div>
                </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                {loading ? <p className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">{t("loading_invitations")}</p> : invitations.length === 0 ? (
                    <div className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center"><Mail size={28} className="mb-3 text-slate-300 dark:text-slate-600" /><p className="font-semibold text-slate-700 dark:text-slate-300">{t("no_invitations_yet")}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("invitations_will_appear_here")}</p></div>
                ) : <ul className="space-y-2">{invitations.map((invitation) => {
                    const status = getInvitationStatus(invitation);
                    return <li key={invitation.id} className="rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/70 dark:bg-slate-800/50 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-indigo-500 dark:text-indigo-400 shadow-sm"><Mail size={18} /></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{invitation.username || "Pending registration"}</p><p className="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-400">{invitation.email}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Sent {new Date(invitation.created_at).toLocaleDateString()}</p></div></div><span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status] || statusStyles.Pending}`}><StatusIcon status={status} />{status}</span></div></li>;
                })}</ul>}
            </div>
        </section>
    );
}

export default InvitationList;
