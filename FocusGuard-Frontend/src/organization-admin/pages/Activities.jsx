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
        <>
            {/* Replace only the visible strings below */}

            <PageHeader
                title={t(
                    "all_activities",
                    "All Activities"
                )}
                subtitle={t(
                    "search_filter_review_activity",
                    "Search, filter, and review organization activity"
                )}
            />

            <input
                placeholder={t(
                    "search_employee_website_category",
                    "Search employee, website, or category"
                )}
            />

            <select
                value={employeeFilter}
                onChange={(event) =>
                    setEmployeeFilter(
                        event.target.value
                    )
                }
            >
                <option value="all">
                    {t(
                        "all_employees",
                        "All employees"
                    )}
                </option>
            </select>

            <h2>
                {t(
                    "activity_log",
                    "Activity Log"
                )}
            </h2>

            <p>
                {t(
                    "matching_activities",
                    "{count} matching activities"
                ).replace(
                    "{count}",
                    filteredActivities.length
                )}
            </p>

            {error}

            {loading && (
                <div>
                    {t(
                        "loading_activities",
                        "Loading activities..."
                    )}
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>
                            {t(
                                "employee_name",
                                "Employee Name"
                            )}
                        </th>

                        <th>
                            {t(
                                "website",
                                "Website"
                            )}
                        </th>

                        <th>
                            {t(
                                "category",
                                "Category"
                            )}
                        </th>

                        <th>
                            {t(
                                "duration",
                                "Duration"
                            )}
                        </th>

                        <th>
                            {t(
                                "date_time",
                                "Date & Time"
                            )}
                        </th>
                    </tr>
                </thead>
            </table>

            <p>
                {t(
                    "page_of",
                    "Page {page} of {total}"
                )
                    .replace(
                        "{page}",
                        currentPage
                    )
                    .replace(
                        "{total}",
                        pageCount
                    )}
            </p>

            <button>
                {t(
                    "previous",
                    "Previous"
                )}
            </button>

            <button>
                {t(
                    "next",
                    "Next"
                )}
            </button>

            <p>
                {t(
                    "no_activities_found",
                    "No activities found"
                )}
            </p>

            <p>
                {t(
                    "adjust_filters_activity",
                    "Adjust your filters to see more activity."
                )}
            </p>
        </>
    );
}

export default Activities;
