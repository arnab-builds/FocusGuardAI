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
                const response = await getOrganizationActivity();

                setActivities(
                    normalizeOrganizationActivities(response)
                );
            } catch (loadError) {
                console.error(loadError);
                setError("Activities could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, []);

    const employees = useMemo(
        () =>
            Array.from(
                new Set(
                    activities
                        .map((activity) => activity.employee)
                        .filter(Boolean)
                )
            ).sort((a, b) => a.localeCompare(b)),
        [activities]
    );

    const filteredActivities = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return activities.filter((activity) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                [
                    activity.employee,
                    activity.website,
                    activity.category,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesDate =
                !dateFilter ||
                toDateInputValue(activity.start_time) === dateFilter;

            const matchesEmployee =
                employeeFilter === "all" ||
                activity.employee === employeeFilter;

            return (
                matchesSearch &&
                matchesDate &&
                matchesEmployee
            );
        });
    }, [activities, search, dateFilter, employeeFilter]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredActivities.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, pageCount);

    const pageActivities = filteredActivities.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1500px] space-y-7">
                <PageHeader
                    title="All Activities"
                    subtitle="Search, filter, and review organization activity"
                />

                <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[minmax(240px,1fr)_220px_240px]">
                        <label className="relative block">
                            <Search
                                size={18}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search employee, website, or category"
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </label>

                        <label className="relative block">
                            <CalendarDays
                                size={18}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(event) => {
                                    setDateFilter(event.target.value);
                                    setPage(1);
                                }}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </label>

                        <label className="relative block">
                            <UserRound
                                size={18}
                                className="absolute left-4 top-3.5 text-slate-400"
                            />

                            <select
                                value={employeeFilter}
                                onChange={(event) => {
                                    setEmployeeFilter(event.target.value);
                                    setPage(1);
                                }}
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="all">
                                    All employees
                                </option>

                                {employees.map((employee) => (
                                    <option
                                        value={employee}
                                        key={employee}
                                    >
                                        {employee}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Activity Log
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {filteredActivities.length} matching activities
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm font-medium text-amber-800">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-3 p-6">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="h-14 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : pageActivities.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[860px] text-left">
                                    <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4">
                                                Employee Name
                                            </th>
                                            <th className="px-6 py-4">
                                                Website
                                            </th>
                                            <th className="px-6 py-4">
                                                Category
                                            </th>
                                            <th className="px-6 py-4">
                                                Duration
                                            </th>
                                            <th className="px-6 py-4">
                                                Date & Time
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {pageActivities.map(
                                            (activity, index) => {
                                                const status =
                                                    getEmployeeOnlineStatus(
                                                        activity
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            activity.id ||
                                                            index
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-slate-900">
                                                                {
                                                                    activity.employee
                                                                }
                                                            </div>

                                                            {status && (
                                                                <div className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                                                                    <span
                                                                        className={`h-2 w-2 rounded-full ${
                                                                            status ===
                                                                            "Online"
                                                                                ? "bg-emerald-500"
                                                                                : "bg-slate-300"
                                                                        }`}
                                                                    />
                                                                    {status}
                                                                </div>
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4 font-medium text-slate-700">
                                                            {activity.website}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                                {
                                                                    activity.category
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                                            {formatDuration(
                                                                activity.duration
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {formatDateTime(
                                                                activity.start_time
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Page {currentPage} of {pageCount}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage((value) =>
                                                Math.max(1, value - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage((value) =>
                                                Math.min(
                                                    pageCount,
                                                    value + 1
                                                )
                                            )
                                        }
                                        disabled={
                                            currentPage === pageCount
                                        }
                                        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <Search size={20} />
                            </div>

                            <p className="font-semibold text-slate-800">
                                No activities found
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Adjust your filters to see more activity.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Activities;
