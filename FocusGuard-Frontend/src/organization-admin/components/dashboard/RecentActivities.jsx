import { Link } from "react-router-dom";
import { ArrowRight, Clock3 } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    formatDuration,
    getEmployeeOnlineStatus,
} from "../../utils/activityUtils";

function RecentActivities({ activities = [] }) {
    const { t } = useLanguage();

    const latestActivities = activities.slice(0, 5);

    return (
        <div className="h-full rounded-[18px] border border-cyan-100/50 dark:border-cyan-900/50 bg-gradient-to-br from-cyan-50/70 to-white dark:from-cyan-950/20 dark:to-slate-800 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 px-6 py-5">
                <div>
                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                        {t(
                            "activity_feed",
                            "Activity Feed"
                        )}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">
                        {t(
                            "recent_activities",
                            "Recent Activities"
                        )}
                    </h2>
                </div>

                
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {latestActivities.length > 0 ? (
                    latestActivities.map(
                        (activity, index) => {
                            const status =
                                getEmployeeOnlineStatus(
                                    activity
                                );

                            return (
                                <div
                                    key={
                                        activity.id ||
                                        index
                                    }
                                    className="px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate font-semibold text-slate-900 dark:text-slate-200">
                                                    {
                                                        activity.employee
                                                    }
                                                </p>

                                                {status && (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
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

                                            <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">
                                                {
                                                    activity.website
                                                }
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            <Clock3
                                                size={14}
                                            />
                                            {formatDuration(
                                                activity.duration
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                            {
                                                activity.category
                                            }
                                        </span>
                                    </div>
                                </div>
                            );
                        }
                    )
                ) : (
                    <div className="px-6 py-12 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            <Clock3 size={20} />
                        </div>

                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {t(
                                "no_recent_activity",
                                "No recent activity yet"
                            )}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t(
                                "employee_activity_tracking_message",
                                "Employee activity will appear here after tracking starts."
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecentActivities;