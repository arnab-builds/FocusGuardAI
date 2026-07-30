import { useEffect, useMemo, useState } from "react";
import {
    Check,
    Eye,
    X,
    Search,
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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b">
                <div className="relative w-96">
                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full pl-10 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t(
                            "search_organization",
                            "Search organization..."
                        )}
                    />
                </div>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50 text-gray-600">
                        <th className="p-5">
                            {t(
                                "organization",
                                "Organization"
                            )}
                        </th>

                        <th>
                            {t(
                                "reason",
                                "Reason"
                            )}
                        </th>

                        <th>
                            {t(
                                "status",
                                "Status"
                            )}
                        </th>

                        <th>
                            {t(
                                "date",
                                "Date"
                            )}
                        </th>

                        <th className="text-center">
                            {t(
                                "actions",
                                "Actions"
                            )}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-12 text-center text-gray-500"
                            >
                                {t(
                                    "loading_requests",
                                    "Loading requests..."
                                )}
                            </td>
                        </tr>
                    ) : filteredRequests.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-12 text-center text-gray-500"
                            >
                                {t(
                                    "no_deactivation_requests_found",
                                    "No deactivation requests found."
                                )}
                            </td>
                        </tr>
                    ) : (
                        filteredRequests.map((request) => (
                            <tr
                                key={request.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="p-5">
                                    <div className="font-semibold text-gray-900">
                                        {
                                            request.organization
                                        }
                                    </div>

                                    <div className="text-sm text-gray-500 mt-1">
                                        {request.admin}
                                    </div>
                                </td>

                                <td className="text-gray-700 max-w-sm">
                                    {request.reason}
                                </td>

                                <td>
                                    {request.status ===
                                        "PENDING" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                            {t(
                                                "pending",
                                                "Pending"
                                            )}
                                        </span>
                                    )}

                                    {request.status ===
                                        "APPROVED" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                            {t(
                                                "approved",
                                                "Approved"
                                            )}
                                        </span>
                                    )}

                                    {request.status ===
                                        "REJECTED" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                                            {t(
                                                "rejected",
                                                "Rejected"
                                            )}
                                        </span>
                                    )}
                                </td>

                                <td className="text-gray-600">
                                    {new Date(
                                        request.requested_at
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    <div className="flex justify-center gap-3">
                                        {request.status ===
                                        "PENDING" ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setSelectedRequest(
                                                            request
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                                >
                                                    <Eye
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "view",
                                                        "View"
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        approve(
                                                            request.id
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                                                >
                                                    <Check
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "approve",
                                                        "Approve"
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        reject(
                                                            request.id
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                                                >
                                                    <X
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "reject",
                                                        "Reject"
                                                    )}
                                                </button>
                                            </>
                                        ) : request.status ===
                                          "APPROVED" ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setSelectedRequest(
                                                            request
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                                >
                                                    <Eye
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "view",
                                                        "View"
                                                    )}
                                                </button>

                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">
                                                    <Check
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "approved",
                                                        "Approved"
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setSelectedRequest(
                                                            request
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                                >
                                                    <Eye
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "view",
                                                        "View"
                                                    )}
                                                </button>

                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold">
                                                    <X
                                                        size={
                                                            18
                                                        }
                                                    />
                                                    {t(
                                                        "rejected",
                                                        "Rejected"
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-between items-center p-5 border-t">
                <p className="text-gray-500">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b p-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {t(
                                    "deactivation_request",
                                    "Deactivation Request"
                                )}
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedRequest(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {t(
                                        "organization",
                                        "Organization"
                                    )}
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">
                                    {
                                        selectedRequest.organization
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {t(
                                        "requested_by",
                                        "Requested By"
                                    )}
                                </p>

                                <p className="mt-1 text-gray-900">
                                    {
                                        selectedRequest.admin
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {t(
                                        "reason",
                                        "Reason"
                                    )}
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                                    {
                                        selectedRequest.reason
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {t(
                                            "status",
                                            "Status"
                                        )}
                                    </p>

                                    <p className="mt-1 text-gray-900">
                                        {
                                            selectedRequest.status
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {t(
                                            "requested",
                                            "Requested"
                                        )}
                                    </p>

                                    <p className="mt-1 text-gray-900">
                                        {new Date(
                                            selectedRequest.requested_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t p-6">
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
                                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
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
                                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
                                className="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50"
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