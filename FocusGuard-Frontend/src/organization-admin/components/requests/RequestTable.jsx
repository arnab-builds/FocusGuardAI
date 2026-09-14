import { useEffect, useState } from "react";

import { useLanguage } from "../../context/useLanguage";

import {
    getRequests,
    approveRequest,
    rejectRequest,
} from "../../services/requestService";

import {
    getApiErrorMessage,
    normalizeListResponse,
    normalizeStatus,
} from "../../utils/responseUtils";
import { fetchWithCache, getCache, setCache } from "../../../utils/apiCache";

function RequestTable() {
    const { t } = useLanguage();

    const getStatusLabel = (status) => {
        const labels = {
            PENDING: t("pending", "Pending"),
            APPROVED: t("accepted", "Approved"),
            REJECTED: t("reject", "Rejected"),
        };

        return (
            labels[normalizeStatus(status)] ||
            t("unknown", "Unknown")
        );
    };

    const getStatusPillClasses = (status) => {
        const classes = {
            PENDING:
                "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
            APPROVED:
                "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
            REJECTED:
                "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        };

        return (
            classes[normalizeStatus(status)] ||
            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        );
    };

    const cacheKey = "org-requests";

    const [requests, setRequests] = useState(() => {
        const cached = getCache(cacheKey);
        return cached ? normalizeListResponse(cached, ["results", "requests", "data", "items"]) : [];
    });
    const [loading, setLoading] = useState(() => !getCache(cacheKey));
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            if (!getCache(cacheKey)) setLoading(true);
            const requestData = await fetchWithCache(cacheKey, getRequests);

            const processed = normalizeListResponse(
                requestData,
                [
                    "results",
                    "requests",
                    "data",
                ]
            );
            
            setRequests(processed);
            setCache(cacheKey, processed);

            setError("");
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "requests_load_failed",
                        "Requests could not be loaded."
                    )
                )
            );
        } finally {
            setLoading(false);
        }
    }

    const getEmployeeName = (
        request
    ) => {
        const employeeId =
            request.employee?.id ||
            request.employee;

        return (
            request.employee_name ||
            request.employee
                ?.full_name ||
            request.employee
                ?.username ||
            `${t(
                "employee",
                "Employee"
            )} #${
                employeeId ||
                t(
                    "unknown",
                    "Unknown"
                )
            }`
        );
    };

    const getEmployeeId = (request) =>
        request.employee?.id ||
        request.employee ||
        t("unknown", "Unknown");

    const handleApprove = async (
        id
    ) => {
        try {
            setActionId(id);

            await approveRequest(id);

            loadRequests();
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "request_approve_failed",
                        "Request could not be approved."
                    )
                )
            );
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (
        id
    ) => {
        try {
            setActionId(id);

            await rejectRequest(id);

            loadRequests();
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "request_reject_failed",
                        "Request could not be rejected."
                    )
                )
            );
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="rounded-3xl border border-indigo-100/50 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-800 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            {error && (
                <div className="flex items-start gap-3 border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-6 py-4">
                    <span className="text-xl leading-none mt-0.5">
                        ⚠️
                    </span>

                    <p className="text-sm sm:text-base font-medium text-red-700 dark:text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="p-5 sm:p-6 space-y-4">
                    {[0, 1, 2, 3].map((skeleton) => (
                        <div
                            key={skeleton}
                            className="rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 animate-pulse"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-2.5 flex-1">
                                    <div className="h-4 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    <div className="h-3.5 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
                                </div>

                                <div className="h-8 w-24 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : requests.length >
              0 ? (
                <>
                    {/* Desktop / tablet table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-indigo-50/50 dark:bg-indigo-900/20">
                                <tr>
                                    <th className="px-6 py-5 text-left text-sm uppercase tracking-wider font-bold text-slate-700 dark:text-slate-200">
                                        {t(
                                            "employee",
                                            "Employee"
                                        )}
                                    </th>

                                    <th className="px-6 py-5 text-left text-sm uppercase tracking-wider font-bold text-slate-700 dark:text-slate-200">
                                        {t(
                                            "reason",
                                            "Reason"
                                        )}
                                    </th>

                                    <th className="px-6 py-5 text-left text-sm uppercase tracking-wider font-bold text-slate-700 dark:text-slate-200">
                                        {t(
                                            "status",
                                            "Status"
                                        )}
                                    </th>

                                    <th className="px-6 py-5 text-center text-sm uppercase tracking-wider font-bold text-slate-700 dark:text-slate-200">
                                        {t(
                                            "action",
                                            "Action"
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {requests.map(
                                    (request) => (
                                        <tr
                                            key={
                                                request.id
                                            }
                                            className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-lg leading-none">
                                                        👤
                                                    </span>

                                                    <div>
                                                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                                            {getEmployeeName(
                                                                request
                                                            )}
                                                        </p>

                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {t(
                                                                "employee",
                                                                "Employee"
                                                            )}{" "}
                                                            #
                                                            {getEmployeeId(
                                                                request
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 max-w-md">
                                                <p className="leading-6 text-slate-700 dark:text-slate-300">
                                                    {
                                                        request.reason
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${getStatusPillClasses(
                                                        request.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        request.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                {normalizeStatus(
                                                    request.status
                                                ) ===
                                                    "PENDING" && (
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    request.id
                                                                )
                                                            }
                                                            disabled={
                                                                actionId ===
                                                                request.id
                                                            }
                                                            className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow-sm transition-all duration-200 hover:from-green-700 hover:to-green-800 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                                        >
                                                            {t(
                                                                "approve",
                                                                "Approve"
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleReject(
                                                                    request.id
                                                                )
                                                            }
                                                            disabled={
                                                                actionId ===
                                                                request.id
                                                            }
                                                            className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-sm transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                                        >
                                                            {t(
                                                                "reject",
                                                                "Reject"
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden flex flex-col gap-4 p-4">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col gap-4"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="text-lg leading-none shrink-0">
                                        👤
                                    </span>

                                    <div className="min-w-0">
                                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {getEmployeeName(
                                                request
                                            )}
                                        </p>

                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {t(
                                                "employee",
                                                "Employee"
                                            )}{" "}
                                            #
                                            {getEmployeeId(
                                                request
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <p className="leading-6 text-slate-700 dark:text-slate-300 text-sm">
                                    {request.reason}
                                </p>

                                <span
                                    className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold ${getStatusPillClasses(
                                        request.status
                                    )}`}
                                >
                                    {getStatusLabel(
                                        request.status
                                    )}
                                </span>

                                {normalizeStatus(
                                    request.status
                                ) === "PENDING" && (
                                    <div className="flex flex-col gap-2.5">
                                        <button
                                            onClick={() =>
                                                handleApprove(
                                                    request.id
                                                )
                                            }
                                            disabled={
                                                actionId ===
                                                request.id
                                            }
                                            className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow-sm transition-all duration-200 hover:from-green-700 hover:to-green-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t(
                                                "approve",
                                                "Approve"
                                            )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    request.id
                                                )
                                            }
                                            disabled={
                                                actionId ===
                                                request.id
                                            }
                                            className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-sm transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t(
                                                "reject",
                                                "Reject"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="p-14 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="text-5xl leading-none">
                        📋✅
                    </span>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t(
                            "no_pending_requests_heading",
                            "No Pending Requests"
                        )}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                        {t(
                            "no_pending_requests",
                            "All employee requests have been processed. New requests will appear here."
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

export default RequestTable;