import { useEffect, useMemo, useState } from "react";
import {
    Check,
    Eye,
    X,
    Search,
    Loader2,
    ClipboardList,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    getOrganizationDeactivationRequests,
    approveOrganizationDeactivation,
    rejectOrganizationDeactivation,
} from "../../services/superAdminService";

function RequestsTable() {
    const { t } = useLanguage();

    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const loadRequests = async () => {
        try {
            setLoading(true);

            const res =
                await getOrganizationDeactivationRequests();

            setRequests(res.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        const query = search.toLowerCase();

        return requests.filter((request) => {
            return (
                String(request.organization || "")
                    .toLowerCase()
                    .includes(query) ||
                String(request.admin || "")
                    .toLowerCase()
                    .includes(query) ||
                String(request.reason || "")
                    .toLowerCase()
                    .includes(query) ||
                String(request.status || "")
                    .toLowerCase()
                    .includes(query)
            );
        });
    }, [requests, search]);

    const approve = async (id) => {
        if (
            !window.confirm(
                t(
                    "approve_deactivation_request_confirmation",
                    "Approve this deactivation request?"
                )
            )
        )
            return;

        try {
            await approveOrganizationDeactivation(id);

            alert(
                t(
                    "organization_deactivated",
                    "Organization deactivated."
                )
            );

            loadRequests();
        } catch (err) {
            console.error(err);
            alert(
                t(
                    "failed_to_approve_request",
                    "Failed to approve request."
                )
            );
        }
    };

    const reject = async (id) => {
        if (
            !window.confirm(
                t(
                    "reject_request_confirmation",
                    "Reject this request?"
                )
            )
        )
            return;

        try {
            await rejectOrganizationDeactivation(id);

            alert(
                t(
                    "request_rejected",
                    "Request rejected."
                )
            );

            loadRequests();
        } catch (err) {
            console.error(err);
            alert(
                t(
                    "failed_to_reject_request",
                    "Failed to reject request."
                )
            );
        }
    };

    const renderStatusBadge = (status) => {
        if (status === "PENDING") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs font-bold shadow-sm ring-1 ring-amber-200/70">
                    {t(
                        "pending",
                        "Pending"
                    )}
                </span>
            );
        }

        if (status === "APPROVED") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-700 text-xs font-bold shadow-sm ring-1 ring-emerald-200/70">
                    {t(
                        "approved",
                        "Approved"
                    )}
                </span>
            );
        }

        if (status === "REJECTED") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-rose-50 text-red-700 text-xs font-bold shadow-sm ring-1 ring-red-200/70">
                    {t(
                        "rejected",
                        "Rejected"
                    )}
                </span>
            );
        }

        return null;
    };

    const renderActions = (request, size = "default") => {
        const btnBase =
            size === "compact"
                ? "flex-1 flex items-center justify-center gap-1.5 py-2 text-sm"
                : "flex items-center gap-2 px-4 py-2";

        if (request.status === "PENDING") {
            return (
                <>
                    <button
                        onClick={() =>
                            setSelectedRequest(request)
                        }
                        className={`${btnBase} rounded-xl font-medium bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95`}
                    >
                        <Eye size={18} />
                        {t(
                            "view",
                            "View"
                        )}
                    </button>

                    <button
                        onClick={() =>
                            approve(request.id)
                        }
                        className={`${btnBase} rounded-xl font-medium bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95`}
                    >
                        <Check size={18} />
                        {t(
                            "approve",
                            "Approve"
                        )}
                    </button>

                    <button
                        onClick={() =>
                            reject(request.id)
                        }
                        className={`${btnBase} rounded-xl font-medium bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95`}
                    >
                        <X size={18} />
                        {t(
                            "reject",
                            "Reject"
                        )}
                    </button>
                </>
            );
        }

        if (request.status === "APPROVED") {
            return (
                <button
                    onClick={() =>
                        setSelectedRequest(request)
                    }
                    className={`${btnBase} rounded-xl font-medium bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95`}
                >
                    <Eye size={18} />
                    {t(
                        "view",
                        "View"
                    )}
                </button>
            );
        }

        return (
            <button
                onClick={() =>
                    setSelectedRequest(request)
                }
                className={`${btnBase} rounded-xl font-medium bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95`}
            >
                <Eye size={18} />
                {t(
                    "view",
                    "View"
                )}
            </button>
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300">
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-100">
                <div className="relative w-full sm:w-96">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500"
                        size={18}
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-300 hover:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                        placeholder={t(
                            "search_organization",
                            "Search organization..."
                        )}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-5 bg-white">
                    <Loader2
                        className="animate-spin text-blue-600"
                        size={36}
                    />

                    <p className="mt-5 text-base font-semibold text-slate-700">
                        {t(
                            "loading_requests",
                            "Loading requests..."
                        )}
                    </p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-300 ring-1 ring-blue-100 mb-4">
                        <ClipboardList size={28} strokeWidth={1.5} />
                    </div>

                    <p className="text-base font-semibold text-slate-600">
                        {t(
                            "no_deactivation_requests_found",
                            "No deactivation requests found."
                        )}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop / tablet table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 border-b border-slate-200">
                                    <th className="p-5">
                                        {t(
                                            "organization",
                                            "Organization"
                                        )}
                                    </th>

                                    <th className="p-5">
                                        {t(
                                            "reason",
                                            "Reason"
                                        )}
                                    </th>

                                    <th className="p-5">
                                        {t(
                                            "status",
                                            "Status"
                                        )}
                                    </th>

                                    <th className="p-5">
                                        {t(
                                            "date",
                                            "Date"
                                        )}
                                    </th>

                                    <th className="p-5 text-center">
                                        {t(
                                            "actions",
                                            "Actions"
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRequests.map(
                                    (request, index) => (
                                        <tr
                                            key={request.id}
                                            className={`border-b border-slate-100 last:border-none hover:bg-blue-50/50 transition-all duration-300 ${
                                                index % 2 === 1
                                                    ? "bg-slate-50/40"
                                                    : ""
                                            }`}
                                        >
                                            <td className="p-5">
                                                <div className="font-semibold text-slate-900">
                                                    {
                                                        request.organization
                                                    }
                                                </div>

                                                <div className="text-sm text-slate-500 mt-1">
                                                    {request.admin}
                                                </div>
                                            </td>

                                            <td className="p-5 max-w-sm">
                                                <p className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                    {request.reason}
                                                </p>
                                            </td>

                                            <td className="p-5">
                                                {renderStatusBadge(
                                                    request.status
                                                )}
                                            </td>

                                            <td className="p-5">
                                                <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-sm text-slate-600 ring-1 ring-slate-100">
                                                    {new Date(
                                                        request.requested_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </td>

                                            <td className="p-5">
                                                <div className="flex justify-center gap-2">
                                                    {renderActions(
                                                        request
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="md:hidden p-4 space-y-3">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {request.organization}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-0.5 truncate">
                                            {request.admin}
                                        </p>
                                    </div>

                                    {renderStatusBadge(
                                        request.status
                                    )}
                                </div>

                                <p className="mt-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-600 leading-relaxed">
                                    {request.reason}
                                </p>

                                <div className="mt-3">
                                    <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-sm text-slate-600 ring-1 ring-slate-100">
                                        {new Date(
                                            request.requested_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                    {renderActions(
                                        request,
                                        "compact"
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="flex justify-center sm:justify-between items-center p-5 border-t border-slate-100">
                <p className="text-sm text-slate-500 text-center sm:text-left">
                    {t(
                        "showing_of_requests",
                        "Showing {filtered} of {total} requests"
                    )
                        .replace(
                            "{filtered}",
                            filteredRequests.length
                        )
                        .replace(
                            "{total}",
                            requests.length
                        )}
                </p>
            </div>

            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100 border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div className="flex items-center gap-3">
                                <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-blue-600" />

                                <h2 className="text-xl font-bold text-slate-900">
                                    {t(
                                        "deactivation_request",
                                        "Deactivation Request"
                                    )}
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedRequest(
                                        null
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 p-6">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {t(
                                        "organization",
                                        "Organization"
                                    )}
                                </p>

                                <p className="mt-1.5 font-semibold text-slate-900">
                                    {
                                        selectedRequest.organization
                                    }
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {t(
                                        "requested_by",
                                        "Requested By"
                                    )}
                                </p>

                                <p className="mt-1.5 text-slate-900">
                                    {
                                        selectedRequest.admin
                                    }
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {t(
                                        "reason",
                                        "Reason"
                                    )}
                                </p>

                                <p className="mt-1.5 whitespace-pre-wrap text-slate-900 leading-relaxed">
                                    {
                                        selectedRequest.reason
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        {t(
                                            "status",
                                            "Status"
                                        )}
                                    </p>

                                    <div className="mt-1.5">
                                        {renderStatusBadge(
                                            selectedRequest.status
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        {t(
                                            "requested",
                                            "Requested"
                                        )}
                                    </p>

                                    <p className="mt-1.5 text-sm text-slate-900">
                                        {new Date(
                                            selectedRequest.requested_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-slate-100 p-6">
                            {selectedRequest.status ===
                                "PENDING" && (
                                <>
                                    <button
                                        onClick={() => {
                                            const requestId =
                                                selectedRequest.id;
                                            setSelectedRequest(
                                                null
                                            );
                                            approve(
                                                requestId
                                            );
                                        }}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2.5 text-white font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                    >
                                        <Check
                                            size={18}
                                        />
                                        {t(
                                            "approve",
                                            "Approve"
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            const requestId =
                                                selectedRequest.id;
                                            setSelectedRequest(
                                                null
                                            );
                                            reject(
                                                requestId
                                            );
                                        }}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-white font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                    >
                                        <X
                                            size={18}
                                        />
                                        {t(
                                            "reject",
                                            "Reject"
                                        )}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() =>
                                    setSelectedRequest(
                                        null
                                    )
                                }
                                className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 font-medium shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                            >
                                {t(
                                    "close",
                                    "Close"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RequestsTable;