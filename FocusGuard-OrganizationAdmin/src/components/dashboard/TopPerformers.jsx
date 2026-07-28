import { Award, TrendingUp } from "lucide-react";

import {
    getEmployeeOnlineStatus,
    getProductivityScore,
} from "../../utils/activityUtils";

const rankLabels = [
    "🥇 Rank 1",
    "🥈 Rank 2",
    "🥉 Rank 3",
];

function TopPerformers({ employees = [] }) {
    const topEmployees = [...employees]
        .sort(
            (a, b) =>
                getProductivityScore(b) -
                getProductivityScore(a)
        )
        .slice(0, 5);

    return (
        <div className="h-full rounded-[18px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                        Performance
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Top Performers
                    </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp size={19} />
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {topEmployees.length > 0 ? (
                    topEmployees.map((employee, index) => {
                        const score = getProductivityScore(employee);
                        const status =
                            getEmployeeOnlineStatus(employee);

                        return (
                            <div
                                key={employee.id}
                                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Award size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {employee.username}
                                        </p>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                            <span className="font-semibold text-slate-600">
                                                {rankLabels[index] ||
                                                    `Rank ${index + 1}`}
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
                                    <p className="text-lg font-extrabold text-emerald-600">
                                        {score.toFixed(1)}%
                                    </p>

                                    <p className="text-xs font-medium text-slate-500">
                                        Productivity
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <Award size={20} />
                        </div>

                        <p className="font-semibold text-slate-800">
                            No performer data yet
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Rankings will appear after employees generate activity.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopPerformers;
