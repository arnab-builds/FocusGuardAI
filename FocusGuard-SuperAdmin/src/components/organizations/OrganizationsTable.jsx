import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import StatusBadge from "../ui/StatusBadge";
import EditOrganizationModal from "./EditOrganizationModal";
import DeleteOrganizationModal from "./DeleteOrganizationModal";

function OrganizationsTable({
  organizations = [],
  refreshOrganizations,
}) {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState(null);

  const filteredOrganizations = useMemo(() => {

    return organizations.filter((org) => {

      const searchMatch =
        org.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        status === "All Status"
          ? true
          : org.status === status;

      return searchMatch && statusMatch;

    });

  }, [organizations, search, status]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

        <div className="flex justify-between items-center p-6 border-b">

          <div className="relative w-96">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              placeholder="Search organization..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >

            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>

          </select>

        </div>

        <table className="w-full">

          <thead>

            <tr className="border-b text-left text-gray-500">

              <th className="p-5">
                Organization
              </th>

              <th>
                Admin
              </th>

              <th>
                Employees
              </th>

              <th>
                Productive
              </th>

              <th>
                Status
              </th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrganizations.map((org) => (

              <tr
                key={org.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-5 font-semibold">
                  {org.name}
                </td>

                <td>
                  {org.admin}
                </td>

                <td>
                  {org.employees}
                </td>

                <td className="text-green-600 font-semibold">
                  {org.productive}%
                </td>

                <td>
                  <StatusBadge
                    status={org.status}
                  />
                </td>

                <td>

                  <div className="flex justify-center gap-3">

                    <Link
                      to={`/organizations/${org.id}`}
                      className="p-2 rounded-lg hover:bg-blue-100"
                    >
                      <Eye size={18} />
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedOrg(org);
                        setEditOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-yellow-100"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrg(org);
                        setDeleteOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="flex justify-between items-center p-5">

          <p className="text-gray-500">
            Showing {filteredOrganizations.length} of {organizations.length} organizations
          </p>

        </div>

      </div>

      <EditOrganizationModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          refreshOrganizations();
        }}
        organization={selectedOrg}
      />

      <DeleteOrganizationModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          refreshOrganizations();
        }}
        organization={selectedOrg}
      />

    </>
  );
}

export default OrganizationsTable;