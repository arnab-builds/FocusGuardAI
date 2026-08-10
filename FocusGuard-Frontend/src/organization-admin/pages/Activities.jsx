import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Search,
    UserRound,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/common/PageHeader";

import { useLanguage } from "../context/useLanguage";

import { getOrganizationActivity } from "../services/dashboardService";
import {
    formatDateTime,
    formatDuration,
    getEmployeeOnlineStatus,
    normalizeOrganizationActivities,
} from "../utils/activityUtils";

const PAGE_SIZE = 10;

const toDateInputValue = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toISOString().slice(0, 10);
};

function Activities() {
    const { currentLanguageCode, t } = useLanguage();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [employeeFilter, setEmployeeFilter] = useState("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadActivities = async () => {
            try {
                const response =
                    await getOrganizationActivity(
                        currentLanguageCode
                    );

                setActivities(
                    normalizeOrganizationActivities(
                        response
                    )
                );
            } catch (loadError) {
                console.error(loadError);

                setError(
                    t(
                        "activities_load_failed",
                        "Activities could not be loaded."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, [currentLanguageCode, t]);

    const employees = useMemo(
        () =>
            Array.from(
                new Set(
                    activities
                        .map(
                            (activity) =>
                                activity.employee
                        )
                        .filter(Boolean)
                )
            ).sort((a, b) =>
                a.localeCompare(b)
            ),
        [activities]
    );

    const filteredActivities =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return activities.filter(
                (activity) => {
                    const matchesSearch =
                        normalizedSearch.length ===
                            0 ||
                        [
                            activity.employee,
                            activity.website,
                            activity.category,
                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            );

                    const matchesDate =
                        !dateFilter ||
                        toDateInputValue(
                            activity.start_time
                        ) === dateFilter;

                    const matchesEmployee =
                        employeeFilter ===
                            "all" ||
                        activity.employee ===
                            employeeFilter;

                    return (
                        matchesSearch &&
                        matchesDate &&
                        matchesEmployee
                    );
                }
            );
        }, [
            activities,
            search,
            dateFilter,
            employeeFilter,
        ]);

    const pageCount = Math.max(
        1,
        Math.ceil(
            filteredActivities.length /
                PAGE_SIZE
        )
    );

    const currentPage = Math.min(
        page,
        pageCount
    );

    const pageActivities =
        filteredActivities.slice(
            (currentPage - 1) *
                PAGE_SIZE,
            currentPage * PAGE_SIZE
        );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <PageHeader
                    title={t("all_activities", "All Activities")}
                    subtitle={t("search_filter_review_activity", "Search, filter, and review organization activity")}
                />

                <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white shadow-md p-5 sm:p-6 flex flex-col md:flex-row gap-4">
                    <input
                        placeholder={t("search_employee_website_category", "Search employee, website, or category")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    <select
                        value={employeeFilter}
                        onChange={(event) => setEmployeeFilter(event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">{t("all_employees", "All employees")}</option>
                        {employees.map(emp => <option key={emp} value={emp}>{emp}</option>)}
                    </select>
                </div>

                <div className="rounded-3xl border border-cyan-100/50 bg-gradient-to-br from-cyan-50/70 to-white shadow-md overflow-hidden p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            {t("activity_log", "Activity Log")}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 bg-white/50 px-3 py-1 rounded-full border border-slate-200">
                            {t("matching_activities", "{count} matching activities").replace("{count}", filteredActivities.length)}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-12 flex items-center justify-center text-slate-500 font-medium">
                            <span className="h-5 w-5 mr-3 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                            {t("loading_activities", "Loading activities...")}
                        </div>
                    ) : pageActivities.length > 0 ? (
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-cyan-50/50 border-b border-cyan-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">{t("employee_name", "Employee Name")}</th>
                                        <th className="px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">{t("website", "Website")}</th>
                                        <th className="px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">{t("category", "Category")}</th>
                                        <th className="px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">{t("duration", "Duration")}</th>
                                        <th className="px-6 py-4 text-sm uppercase tracking-wide font-bold text-slate-700">{t("date_time", "Date & Time")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageActivities.map((activity, idx) => (
                                        <tr key={activity.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-900 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-200">
                                                        {activity.employee?.charAt(0).toUpperCase()}
                                                    </div>
                                                    {activity.employee}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">{activity.website}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">{activity.category || "-"}</span>
                                            </td>
                                            <td className="px-6 py-4 text-indigo-600 font-semibold">{formatDuration(activity.duration_seconds)}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">{formatDateTime(activity.start_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 flex flex-col items-center text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <span className="text-4xl mb-4">📭</span>
                            <p className="text-lg text-slate-800 font-bold">{t("no_activities_found", "No activities found")}</p>
                            <p className="text-slate-500 text-sm mt-1">{t("adjust_filters_activity", "Adjust your filters to see more activity.")}</p>
                        </div>
                    )}

                    {pageCount > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {t("previous", "Previous")}
                            </button>
                            <p className="text-slate-500 text-sm font-medium">
                                {t("page_of", "Page {page} of {total}").replace("{page}", currentPage).replace("{total}", pageCount)}
                            </p>
                            <button
                                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                                disabled={page === pageCount}
                                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {t("next", "Next")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Activities;
