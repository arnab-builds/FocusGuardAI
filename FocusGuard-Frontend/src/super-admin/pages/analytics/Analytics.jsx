import { BarChart3 } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import AdminLayout from "../../components/layout/AdminLayout";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

function Analytics() {
    const { t } = useLanguage();

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white border border-blue-100/70 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                            <BarChart3 size={26} />
                        </span>

                        <div>
                            <div className="flex items-center gap-3">
                                <span className="sm:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                                    <BarChart3 size={18} />
                                </span>

                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    {t("analytics", "Analytics")}
                                </h1>
                            </div>

                            <p className="text-slate-500 mt-2">
                                {t(
                                    "platform_analytics_overview",
                                    "Platform analytics overview."
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="p-4 sm:p-6">
                        <AnalyticsCharts />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Analytics;