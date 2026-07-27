import { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Search,
} from "lucide-react";

import {
  getOrganizationDeactivationRequests,
  approveOrganizationDeactivation,
  rejectOrganizationDeactivation,
} from "../../services/superAdminService";

function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
        "Approve this deactivation request?"
      )
    )
      return;

    try {
      await approveOrganizationDeactivation(id);

      alert("Organization deactivated.");

      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to approve request.");
    }
  };

  const reject = async (id) => {
    if (
      !window.confirm(
        "Reject this request?"
      )
    )
      return;

    try {
      await rejectOrganizationDeactivation(id);

      alert("Request rejected.");

      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
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
            placeholder="Search organization..."
          />

        </div>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b bg-gray-50 text-gray-600">

            <th className="p-5">
              Organization
            </th>

            <th>
              Reason
            </th>

            <th>
              Status
            </th>

            <th>
              Date
            </th>

            <th className="text-center">
              Actions
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
                Loading requests...
              </td>
            </tr>
          ) : filteredRequests.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-gray-500"
              >
                No deactivation requests found.
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
                    {request.organization}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {request.admin}
                  </div>
                </td>

                <td className="text-gray-700 max-w-sm">
                  {request.reason}
                </td>

                <td>
                  {request.status === "PENDING" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                      Pending
                    </span>
                  )}

                  {request.status === "APPROVED" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      Approved
                    </span>
                  )}

                  {request.status === "REJECTED" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                      Rejected
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
                    {request.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() =>
                            approve(request.id)
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          <Check size={18} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            reject(request.id)
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          <X size={18} />
                          Reject
                        </button>
                      </>
                    ) : request.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">
                        <Check size={18} />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold">
                        <X size={18} />
                        Rejected
                      </span>
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
          Showing {filteredRequests.length} of{" "}
          {requests.length} requests
        </p>
      </div>

    </div>
  );
}

export default RequestsTable;