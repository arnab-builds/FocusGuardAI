import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";

import {
    X,
    Activity,
    Gauge,
    Timer,
    TimerOff,
    Globe,
    CalendarDays,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { getEmployeeBrowsingHistory } from "../../services/employeeService";

import {
    getApiErrorMessage,
    getRoundedProductivity,
    normalizeListResponse,
} from "../../utils/responseUtils";
import { translateCategory } from "../../utils/categoryTranslations";

const PAGE_SIZE = 10;

const formatDate = (value, locale) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(locale || undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatTime = (value, locale) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString(locale || undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatDuration = (value, t) => {
    if (!value) return `0 ${t("minutes_short", "mins")}`;

    const parts = String(value).split(":");

    if (parts.length !== 3) return String(value);

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Math.round(Number(parts[2]));

    if (!Number.isFinite(hours + minutes + seconds)) {
        return String(value);
    }

    if (hours > 0 && minutes > 0) {
        return `${hours} ${
            hours === 1
                ? t("hour_short", "hr")
                : t("hours_short_text", "hrs")
        } ${minutes} ${t("minutes_short", "mins")}`;
    }

    if (hours > 0) {
        return `${hours} ${
            hours === 1
                ? t("hour_short", "hr")
                : t("hours_short_text", "hrs")
        }`;
    }

    if (minutes > 0) {
        return `${minutes} ${t("minutes_short", "mins")}`;
    }

    return `${seconds} ${t("seconds_short", "secs")}`;
};

const displayProductivityType = (value, t) => {
    const normalized = String(value || "NEUTRAL").toUpperCase();
    const labels = {
        PRODUCTIVE: t("productive", "Productive"),
        NON_PRODUCTIVE: t("unproductive", "Non Productive"),
        NEUTRAL: t("neutral", "Neutral"),
    };

    return labels[normalized] || normalized
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};

const productivityPillClasses = (value) => {
    const normalized = String(value || "NEUTRAL").toUpperCase();

    if (normalized === "PRODUCTIVE") {
        return "bg-green-50 text-green-700 ring-green-200";
    }

    if (normalized === "NON_PRODUCTIVE") {
        return "bg-red-50 text-red-700 ring-red-200";
    }

    return "bg-yellow-50 text-yellow-700 ring-yellow-200";
};

function EmployeeAnalyticsDialog({
    open,
    onClose,
    employee,
}) {
    const { currentLanguageCode, t } = useLanguage();

    const [historyDate, setHistoryDate] =
        useState("");

    const [historyPage, setHistoryPage] =
        useState(1);

    const [history, setHistory] = useState([]);

    const [historyCount, setHistoryCount] =
        useState(0);

    const [historyLoading, setHistoryLoading] =
        useState(false);

    const [historyError, setHistoryError] =
        useState("");

    useEffect(() => {
        if (!open || !employee?.id) return;

        async function loadHistory() {
            setHistoryLoading(true);
            setHistoryError("");

            try {
                const data =
                    await getEmployeeBrowsingHistory(
                        employee.id,
                        {
                            date: historyDate,
                            language: currentLanguageCode,
                            page: historyPage,
                            pageSize: PAGE_SIZE,
                        }
                    );

                const rows =
                    normalizeListResponse(data, [
                        "results",
                        "activities",
                        "users",
                        "data",
                    ]);

                setHistory(rows);

                setHistoryCount(
                    data?.count ?? rows.length
                );
            } catch (error) {
                setHistory([]);
                setHistoryCount(0);

                setHistoryError(
                    getApiErrorMessage(
                        error,
                        t(
                            "browsing_history_load_failed",
                            "Browsing history could not be loaded."
                        )
                    )
                );
            } finally {
                setHistoryLoading(false);
            }
        }

        loadHistory();
    }, [
        open,
        employee?.id,
        historyDate,
        historyPage,
        currentLanguageCode,
        t,
    ]);

    if (!employee) return null;

    const productivity =
        getRoundedProductivity(employee);

    const productiveTime = formatDuration(
        employee.productive_time ||
            employee.analytics
                ?.productive_time ||
            "0:00:00",
        t
    );

    const nonProductiveTime =
        employee.non_productive_time ||
        employee.unproductive_time ||
        employee.analytics
            ?.non_productive_time ||
        employee.analytics
            ?.unproductive_time ||
        "0:00:00";

    const totalHistoryPages = Math.max(
        1,
        Math.ceil(historyCount / PAGE_SIZE)
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle className="flex justify-between items-start gap-4 px-4 py-5 sm:px-8 sm:py-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {t(
                            "employee_details",
                            "Employee Details"
                        )}
                    </h2>

                    <p className="text-slate-500 text-sm sm:text-base mt-1.5 font-medium">
                        {t(
                            "productivity_activity_summary",
                            "Productivity & Activity Summary"
                        )}
                    </p>
                </div>

                <IconButton onClick={onClose} className="shrink-0">
                    <X size={22} />
                </IconButton>
            </DialogTitle>

            <DialogContent className="px-4 pb-6 sm:px-8 sm:pb-8">
                <div className="space-y-8 py-2">
                    {/* Profile card */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-7 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                            <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-3xl sm:text-4xl font-bold text-indigo-700 ring-2 ring-indigo-200">
                                {employee.username
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div className="flex flex-col gap-2.5 min-w-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                                    {employee.username}
                                </h3>

                                <p className="text-slate-500 text-sm sm:text-base break-all">
                                    {employee.email}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {employee.role && (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-700">
                                            {employee.role}
                                        </span>
                                    )}

                                    <span
                                        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 ${
                                            employee.is_active
                                                ? "bg-green-50 text-green-700 ring-green-200"
                                                : "bg-red-50 text-red-700 ring-red-200"
                                        }`}
                                    >
                                        {employee.is_active
                                            ? t(
                                                  "active",
                                                  "Active"
                                              )
                                            : t(
                                                  "inactive",
                                                  "Inactive"
                                              )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                                        employee.is_active
                                            ? "bg-green-100"
                                            : "bg-red-100"
                                    }`}
                                >
                                    <Activity
                                        size={20}
                                        className={
                                            employee.is_active
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    />
                                </div>

                                <p className="text-base font-semibold text-slate-700">
                                    {t(
                                        "status",
                                        "Status"
                                    )}
                                </p>
                            </div>

                            <h3
                                className={`text-3xl font-bold ${
                                    employee.is_active
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {employee.is_active
                                    ? t(
                                          "active",
                                          "Active"
                                      )
                                    : t(
                                          "inactive",
                                          "Inactive"
                                      )}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <Gauge
                                        size={20}
                                        className="text-indigo-600"
                                    />
                                </div>

                                <p className="text-base font-semibold text-slate-700">
                                    {t(
                                        "productivity",
                                        "Productivity"
                                    )}
                                </p>
                            </div>

                            <h3 className="text-3xl font-bold text-indigo-600">
                                {productivity}%
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <Timer
                                        size={20}
                                        className="text-emerald-600"
                                    />
                                </div>

                                <p className="text-base font-semibold text-slate-700">
                                    {t(
                                        "productive_time",
                                        "Productive Time"
                                    )}
                                </p>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900">
                                {productiveTime}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <TimerOff
                                        size={20}
                                        className="text-orange-600"
                                    />
                                </div>

                                <p className="text-base font-semibold text-slate-700">
                                    {t(
                                        "unproductive_time",
                                        "Unproductive Time"
                                    )}
                                </p>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900">
                                {formatDuration(
                                    nonProductiveTime,
                                    t
                                )}
                            </h3>
                        </div>
                    </div>

                    {/* Browsing history */}
                    <div className="rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
                        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {t(
                                        "browsing_history",
                                        "Browsing Activity"
                                    )}
                                </h3>

                                <p className="text-sm text-slate-500 font-medium mt-1">
                                    {t(
                                        "todays_website_usage",
                                        "Today's Website Usage"
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus-within:border-indigo-500 transition">
                                    <CalendarDays
                                        size={16}
                                        className="text-slate-400 shrink-0"
                                    />

                                    <input
                                        type="date"
                                        value={historyDate}
                                        onChange={(event) => {
                                            setHistoryDate(
                                                event.target
                                                    .value
                                            );
                                            setHistoryPage(
                                                1
                                            );
                                        }}
                                        className="text-sm outline-none bg-transparent"
                                    />
                                </div>

                                {historyDate && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHistoryDate(
                                                ""
                                            );
                                            setHistoryPage(
                                                1
                                            );
                                        }}
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition whitespace-nowrap"
                                    >
                                        {t(
                                            "clear",
                                            "Clear"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {historyError && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {historyError}
                            </div>
                        )}

                        {historyLoading ? (
                            <div className="py-10 text-center text-slate-500 font-medium">
                                {t(
                                    "loading_browsing_history",
                                    "Loading browsing history..."
                                )}
                            </div>
                        ) : history.length >
                          0 ? (
                            <>
                                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm sm:text-base">
                                            <thead className="bg-slate-50 text-left text-slate-700">
                                                <tr>
                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Globe
                                                                size={
                                                                    15
                                                                }
                                                                className="text-slate-400"
                                                            />
                                                            {t(
                                                                "website",
                                                                "Website"
                                                            )}
                                                        </span>
                                                    </th>

                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        {t(
                                                            "tab_name",
                                                            "Tab Name"
                                                        )}
                                                    </th>

                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        {t(
                                                            "category",
                                                            "Category"
                                                        )}
                                                    </th>

                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        {t(
                                                            "duration",
                                                            "Duration"
                                                        )}
                                                    </th>

                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        {t(
                                                            "date",
                                                            "Date"
                                                        )}
                                                    </th>

                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        {t(
                                                            "time",
                                                            "Time"
                                                        )}
                                                    </th>

                                                    <th className="px-5 py-4 font-semibold whitespace-nowrap">
                                                        {t(
                                                            "productivity_type",
                                                            "Productivity Type"
                                                        )}
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {history.map(
                                                    (
                                                        activity
                                                    ) => (
                                                        <tr
                                                            key={
                                                                activity.id
                                                            }
                                                            className="border-t border-slate-100 hover:bg-indigo-50/40 transition-colors"
                                                        >
                                                            <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                                                {activity.website_name ||
                                                                    activity.website ||
                                                                    "-"}
                                                            </td>

                                                            <td className="px-5 py-4 text-slate-600">
                                                                {activity.tab_title ||
                                                                    "-"}
                                                            </td>

                                                            <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                                {activity.category
                                                                    ? translateCategory(
                                                                          activity.category,
                                                                          t,
                                                                          currentLanguageCode
                                                                      )
                                                                    : "-"}
                                                            </td>

                                                            <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                                {formatDuration(
                                                                    activity.duration,
                                                                    t
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                                {formatDate(
                                                                    activity.start_time,
                                                                    currentLanguageCode
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                                {formatTime(
                                                                    activity.start_time,
                                                                    currentLanguageCode
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 ${productivityPillClasses(
                                                                        activity.productivity_type
                                                                    )}`}
                                                                >
                                                                    {displayProductivityType(
                                                                        activity.productivity_type,
                                                                        t
                                                                    )}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-5 w-full flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:flex-row md:items-center md:justify-between text-sm text-slate-600">
                                    <span className="font-medium text-slate-600 text-center md:text-left whitespace-nowrap">
                                        {t(
                                            "showing_records",
                                            "Showing {shown} of {total} records"
                                        )
                                            .replace(
                                                "{shown}",
                                                history.length
                                            )
                                            .replace(
                                                "{total}",
                                                historyCount
                                            )}
                                    </span>

                                    <div className="flex justify-center items-center gap-3 flex-wrap">
                                        <button
                                            type="button"
                                            disabled={
                                                historyPage === 1
                                            }
                                            onClick={() =>
                                                setHistoryPage(
                                                    (
                                                        value
                                                    ) =>
                                                        Math.max(
                                                            1,
                                                            value -
                                                                1
                                                        )
                                                )
                                            }
                                            className={`shrink-0 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                                                historyPage === 1
                                                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 shadow-none"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
                                            }`}
                                        >
                                            ← {t(
                                                "previous",
                                                "Previous"
                                            )}
                                        </button>

                                        <div className="shrink-0 min-w-[110px] whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 text-center">
                                            {t(
                                                "page_of",
                                                "Page {page} of {total}"
                                            )
                                                .replace(
                                                    "{page}",
                                                    historyPage
                                                )
                                                .replace(
                                                    "{total}",
                                                    totalHistoryPages
                                                )}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={
                                                historyPage ===
                                                totalHistoryPages
                                            }
                                            onClick={() =>
                                                setHistoryPage(
                                                    (
                                                        value
                                                    ) =>
                                                        Math.min(
                                                            totalHistoryPages,
                                                            value +
                                                                1
                                                        )
                                                )
                                            }
                                            className={`shrink-0 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                                                historyPage ===
                                                totalHistoryPages
                                                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 shadow-none"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
                                            }`}
                                        >
                                            {t(
                                                "next",
                                                "Next"
                                            )} →
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-10 text-center text-slate-500 font-medium">
                                {t(
                                    "no_browsing_history_found",
                                    "No browsing history found."
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
export default EmployeeAnalyticsDialog;