import { useEffect, useState } from "react";
import { MailPlus, Loader2 } from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
import InvitationsTable from "../../components/invitations/InvitationsTable";

import { useLanguage } from "../../context/useLanguage";

import { getInvitations } from "../../services/superAdminService";

function Invitations() {
    const { t } = useLanguage();

    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadInvitations = async () => {
        try {
            setLoading(true);

            const res = await getInvitations();

            console.log("Invitations API:", res.data);

            setInvitations(res.data);
        } catch (err) {
            console.error("Error loading invitations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvitations();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white border border-blue-100/70 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                                <MailPlus size={26} />
                            </span>

                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="sm:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                                        <MailPlus size={18} />
                                    </span>

                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                        {t(
                                            "invitations",
                                            "Invitations"
                                        )}
                                    </h1>
                                </div>

                                <p className="text-slate-500 mt-2">
                                    {t(
                                        "manage_organization_invitations",
                                        "Manage organization invitations."
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 sm:p-16 flex flex-col items-center justify-center text-center">
                        <Loader2
                            className="animate-spin text-blue-600"
                            size={36}
                        />

                        <p className="mt-5 text-base font-semibold text-slate-700">
                            {t(
                                "loading_invitations",
                                "Loading invitations..."
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="p-2 sm:p-4">
                            <InvitationsTable
                                invitations={invitations}
                                refreshInvitations={loadInvitations}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default Invitations;