import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";

import { X } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { getEmployeeBrowsingHistory } from "../../services/employeeService";

import {
    getApiErrorMessage,
    getRoundedProductivity,
    normalizeListResponse,
} from "../../utils/responseUtils";

const PAGE_SIZE = 10;

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString([], {
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

const displayProductivityType = (value) =>
    String(value || "NEUTRAL")
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );

function EmployeeAnalyticsDialog({
    open,
    onClose,
    employee,
}) {
    const { t } = useLanguage();

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
            maxWidth="md"
            fullWidth
        >
            <DialogTitle className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {t(
                            "employee_details",
                            "Employee Details"
                        )}
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
                        {t(
                            "productivity_activity_summary",
                            "Productivity & Activity Summary"
                        )}
                    </p>
                </div>

                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <div className="space-y-6 py-2">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700">
                            {employee.username
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold">
                                {employee.username}
                            </h3>

                            <p className="text-slate-500">
                                {employee.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                {t(
                                    "status",
                                    "Status"
                                )}
                            </p>

                            <h3
                                className={`mt-2 text-lg font-bold ${
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

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                {t(
                                    "productivity",
                                    "Productivity"
                                )}
                            </p>

                            <h3 className="mt-2 text-lg font-bold text-indigo-600">
                                {productivity}%
                            </h3>
                        </div>
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                {t(
                                    "productive_time",
                                    "Productive Time"
                                )}
                            </p>

                            <h3 className="mt-2 text-lg font-bold">
                                {productiveTime}
                            </h3>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">
                                {t(
                                    "unproductive_time",
                                    "Unproductive Time"
                                )}
                            </p>

                            <h3 className="mt-2 text-lg font-bold">
                                {formatDuration(
                                    nonProductiveTime,
                                    t
                                )}
                            </h3>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <h3 className="font-semibold">
                                {t(
                                    "browsing_history",
                                    "Browsing History"
                                )}
                            </h3>

                            <div className="flex items-center gap-2">
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
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                />

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
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
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
                            <div className="py-8 text-center text-slate-500">
                                {t(
                                    "loading_browsing_history",
                                    "Loading browsing history..."
                                )}
                            </div>
                        ) : history.length >
                          0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-left text-slate-600">
                                            <tr>
                                                <th className="px-4 py-3">
                                                    {t(
                                                        "website",
                                                        "Website"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3">
                                                    {t(
                                                        "tab_name",
                                                        "Tab Name"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3">
                                                    {t(
                                                        "category",
                                                        "Category"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3">
                                                    {t(
                                                        "duration",
                                                        "Duration"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3">
                                                    {t(
                                                        "date",
                                                        "Date"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3">
                                                    {t(
                                                        "time",
                                                        "Time"
                                                    )}
                                                </th>

                                                <th className="px-4 py-3">
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
                                                        className="border-t"
                                                    >
                                                        <td className="px-4 py-3 font-medium text-slate-800">
                                                            {activity.website_name ||
                                                                activity.website ||
                                                                "-"}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-600">
                                                            {activity.tab_title ||
                                                                "-"}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-600">
                                                            {activity.category ||
                                                                "-"}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-600">
                                                            {formatDuration(
                                                                activity.duration,
                                                                t
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-600">
                                                            {formatDate(
                                                                activity.start_time
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-600">
                                                            {formatTime(
                                                                activity.start_time
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-600">
                                                            {displayProductivityType(
                                                                activity.productivity_type
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                                                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                                    <span>
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

                                    <div className="flex items-center gap-2">
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
                                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                                        >
                                            {t(
                                                "previous",
                                                "Previous"
                                            )}
                                        </button>

                                        <span>
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
                                        </span>

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
                                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                                        >
                                            {t(
                                                "next",
                                                "Next"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-8 text-center text-slate-500">
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