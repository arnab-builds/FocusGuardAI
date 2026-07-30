import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import StatusBadge from "../ui/StatusBadge";
import EditOrganizationModal from "./EditOrganizationModal";
import DeleteOrganizationModal from "./DeleteOrganizationModal";

function OrganizationsTable({
    organizations = [],
    refreshOrganizations,
}) {
    const { t } = useLanguage();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedOrg, setSelectedOrg] = useState(null);

    const allStatus = t("all_status", "All Status");
    const active = t("active", "Active");
    const inactive = t("inactive", "Inactive");

    const filteredOrganizations = useMemo(() => {
        return organizations.filter((org) => {
            const searchMatch =
                org.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const statusMatch = !status || org.status === status;

            return searchMatch && statusMatch;
        });
    }, [
        organizations,
        search,
        status,
        allStatus,
    ]);

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
                            placeholder={t(
                                "search_organization",
                                "Search organization..."
                            )}
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                        className="border rounded-xl px-4 py-3"
                    >
                        <option value="">{allStatus}</option>
                        <option value="Active">{active}</option>
                        <option value="Inactive">{inactive}</option>
                    </select>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-gray-500">
                            <th className="p-5">
                                {t(
                                    "organization",
                                    "Organization"
                                )}
                            </th>

                            <th>
                                {t(
                                    "admin",
                                    "Admin"
                                )}
                            </th>

                            <th>
                                {t(
                                    "employees",
                                    "Employees"
                                )}
                            </th>

                            <th>
                                {t(
                                    "productive",
                                    "Productive"
                                )}
                            </th>

                            <th>
                                {t(
                                    "status",
                                    "Status"
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
                        {filteredOrganizations.map(
                            (org) => (
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
                                            status={
                                                org.status
                                            }
                                        />
                                    </td>

                                    <td>
                                        <div className="flex justify-center gap-3">
                                            <Link
                                                to={`/organizations/${org.id}`}
                                                className="p-2 rounded-lg hover:bg-blue-100"
                                            >
                                                <Eye
                                                    size={
                                                        18
                                                    }
                                                />
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    setSelectedOrg(
                                                        org
                                                    );
                                                    setEditOpen(
                                                        true
                                                    );
                                                }}
                                                className="p-2 rounded-lg hover:bg-yellow-100"
                                            >
                                                <Pencil
                                                    size={
                                                        18
                                                    }
                                                />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedOrg(
                                                        org
                                                    );
                                                    setDeleteOpen(
                                                        true
                                                    );
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2
                                                    size={
                                                        18
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                <div className="flex justify-between items-center p-5">
                    <p className="text-gray-500">
                        {t(
                            "showing_of_organizations",
                            "Showing {filtered} of {total} organizations"
                        )
                            .replace(
                                "{filtered}",
                                filteredOrganizations.length
                            )
                            .replace(
                                "{total}",
                                organizations.length
                            )}
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
