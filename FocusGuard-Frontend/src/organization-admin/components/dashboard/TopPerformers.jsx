import { Award, TrendingUp } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    getEmployeeOnlineStatus,
    getProductivityScore,
} from "../../utils/activityUtils";

function TopPerformers({ employees = [] }) {
    const { t } = useLanguage();

    const topEmployees = [...employees]
        .sort(
            (a, b) =>
                getProductivityScore(b) -
                getProductivityScore(a)
        )
        .slice(0, 5);

    const getRankLabel = (index) => {
        switch (index) {
            case 0:
                return t("rank_1", "🥇 Rank 1");
            case 1:
                return t("rank_2", "🥈 Rank 2");
            case 2:
                return t("rank_3", "🥉 Rank 3");
            default: {
                const label = t(
                    "rank_number",
                    "Rank {number}"
                );

                return label
                    .replace("{number}", index + 1)
                    .replace("{rank}", index + 1);
            }
        }
    };

    return (
        <div className="h-full rounded-[18px] border border-emerald-100/50 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/20 dark:to-slate-800 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700/50 px-6 py-5">
                <div>
                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                        {t(
                            "performance",
                            "Performance"
                        )}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">
                        {t(
                            "top_performers",
                            "Top Performers"
                        )}
                    </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <TrendingUp size={19} />
                </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {topEmployees.length > 0 ? (
                    topEmployees.map(
                        (employee, index) => {
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
                                    key={
                                        employee.id
                                    }
                                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                                            <Award
                                                size={
                                                    18
                                                }
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900 dark:text-slate-200">
                                                {
                                                    employee.username
                                                }
                                            </p>

                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="font-semibold text-slate-600 dark:text-slate-300">
                                                    {getRankLabel(
                                                        index
                                                    )}
                                                </span>

                                                {status && (
                                                    <span className="flex items-center gap-1">
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${
                                                                status ===
                                                                "Online"
                                                                    ? "bg-emerald-500"
                                                                    : "bg-slate-300 dark:bg-slate-600"
                                                            }`}
                                                        />
                                                        {
                                                            status
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                                            {score.toFixed(
                                                1
                                            )}
                                            %
                                        </p>

                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {t(
                                                "productivity",
                                                "Productivity"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    )
                ) : (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            <Award
                                size={20}
                            />
                        </div>

                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {t(
                                "no_performer_data",
                                "No performer data yet"
                            )}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t(
                                "performer_data_message",
                                "Rankings will appear after employees generate activity."
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopPerformers;