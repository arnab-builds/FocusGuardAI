import { ShieldAlert } from "lucide-react";

import RequestsTable from "../../components/requests/RequestsTable";

import { useLanguage } from "../../context/useLanguage";

function Requests() {
    const { t } = useLanguage();

    return (
            <div className="space-y-6 sm:space-y-8">
                <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border border-amber-100/70 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                            <ShieldAlert size={26} />
                        </span>

                        <div>
                            <div className="flex items-center gap-3">
                                <span className="sm:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                                    <ShieldAlert size={18} />
                                </span>

                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    {t(
                                        "deactivation_requests",
                                        "Deactivation Requests"
                                    )}
                                </h1>
                            </div>

                            <p className="text-slate-500 mt-2">
                                {t(
                                    "approve_reject_organization_requests",
                                    "Approve or reject organization requests."
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="p-2 sm:p-4">
                        <RequestsTable />
                    </div>
                </div>
            </div>
    );
}

export default Requests;