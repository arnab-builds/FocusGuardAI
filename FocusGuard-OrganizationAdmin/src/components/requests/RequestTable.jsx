import { useEffect, useState } from "react";

import { useLanguage } from "../../context/useLanguage";

import {
    getRequests,
    approveRequest,
    rejectRequest,
} from "../../services/requestService";

import {
    displayStatus,
    getApiErrorMessage,
    normalizeListResponse,
    normalizeStatus,
} from "../../utils/responseUtils";

function RequestTable() {
    const { t } = useLanguage();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const timeout = setTimeout(loadRequests, 0);

        return () => clearTimeout(timeout);
    }, []);

    async function loadRequests() {
        try {
            const requestData =
                await getRequests();

            setRequests(
                normalizeListResponse(
                    requestData,
                    [
                        "results",
                        "requests",
                        "data",
                    ]
                )
            );

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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {error && (
                <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="p-12 text-center text-slate-500">
                    {t(
                        "loading_requests",
                        "Loading requests..."
                    )}
                </div>
            ) : requests.length >
              0 ? (
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                {t(
                                    "employee",
                                    "Employee"
                                )}
                            </th>

                            <th className="px-6 py-4 text-left">
                                {t(
                                    "reason",
                                    "Reason"
                                )}
                            </th>

                            <th className="px-6 py-4 text-left">
                                {t(
                                    "status",
                                    "Status"
                                )}
                            </th>

                            <th className="px-6 py-4 text-center">
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
                                    className="border-t hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        {getEmployeeName(
                                            request
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {
                                            request.reason
                                        }
                                    </td>

                                    <td className="px-6 py-4">
                                        {displayStatus(
                                            request.status
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
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
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
            ) : (
                <div className="p-12 text-center text-slate-500">
                    {t(
                        "no_pending_requests",
                        "No pending requests."
                    )}
                </div>
            )}
        </div>
    );
}

export default RequestTable;