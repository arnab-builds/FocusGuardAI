import { TriangleAlert } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    getEmployeeOnlineStatus,
    getProductivityScore,
    hasAnalyticsData,
} from "../../utils/activityUtils";

const ATTENTION_THRESHOLD = 60;

function AttentionEmployees({ employees = [] }) {
    const { t } = useLanguage();

    const lowPerformers = [...employees]
        .filter(
            (employee) =>
                hasAnalyticsData(employee) &&
                getProductivityScore(employee) <
                    ATTENTION_THRESHOLD
        )
        .sort(
            (a, b) =>
                getProductivityScore(a) -
                getProductivityScore(b)
        )
        .slice(0, 5);

    return (
        <div className="h-full rounded-[18px] border border-rose-100/50 bg-gradient-to-br from-rose-50/70 to-white shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                        {t(
                            "risk_signals",
                            "Risk Signals"
                        )}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {t(
                            "needs_attention",
                            "Needs Attention"
                        )}
                    </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <TriangleAlert size={19} />
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {lowPerformers.length > 0 ? (
                    lowPerformers.map((employee) => {
                        const score =
                            getProductivityScore(
                                employee
                            );

                        const status =
                            getEmployeeOnlineStatus(
                                employee
                            );

                        return (
                            <div
                                key={employee.id}
                                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-rose-50"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                        <TriangleAlert
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {
                                                employee.username
                                            }
                                        </p>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                            <span>
                                                {t(
                                                    "below_threshold",
                                                    "Below"
                                                )}{" "}
                                                {
                                                    ATTENTION_THRESHOLD
                                                }
                                                %
                                            </span>

                                            {status && (
                                                <span className="flex items-center gap-1">
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            status ===
                                                            "Online"
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-300"
                                                        }`}
                                                    />
                                                    {status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-extrabold text-rose-600">
                                        {score.toFixed(
                                            1
                                        )}
                                        %
                                    </p>

                                    <p className="text-xs font-medium text-slate-500">
                                        {t(
                                            "productivity",
                                            "Productivity"
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <TriangleAlert
                                size={20}
                            />
                        </div>

                        <p className="font-semibold text-slate-800">
                            {t(
                                "no_employees_need_attention",
                                "No employees need attention"
                            )}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {t(
                                "employees_below_threshold_message",
                                "Employees under {threshold}% productivity will appear here."
                            ).replace(
                                "{threshold}",
                                ATTENTION_THRESHOLD
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AttentionEmployees;