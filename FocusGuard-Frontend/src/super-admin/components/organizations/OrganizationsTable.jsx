import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Eye,
    Pencil,
    Trash2,
    Building2,
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
            <div className="bg-gradient-to-b from-white to-slate-50/40 rounded-3xl shadow-sm hover:shadow-lg ring-1 ring-slate-100 border border-blue-50 overflow-hidden transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-5 sm:p-6 border-b border-slate-100 bg-white/60">
                    <div className="relative w-full sm:w-96">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500"
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
                            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all duration-300 hover:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                        className="w-full sm:w-auto border border-slate-200 bg-slate-50/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 cursor-pointer"
                    >
                        <option value="">{allStatus}</option>
                        <option value="Active">{active}</option>
                        <option value="Inactive">{inactive}</option>
                    </select>
                </div>

                {filteredOrganizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-5 bg-gradient-to-b from-blue-50/30 to-transparent">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-300 ring-1 ring-blue-100 mb-4">
                            <Building2 size={28} strokeWidth={1.5} />
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            {t(
                                "no_organizations_found",
                                "No organizations found."
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
                                                "admin",
                                                "Admin"
                                            )}
                                        </th>

                                        <th className="p-5">
                                            {t(
                                                "employees",
                                                "Employees"
                                            )}
                                        </th>

                                        <th className="p-5">
                                            {t(
                                                "productive",
                                                "Productive"
                                            )}
                                        </th>

                                        <th className="p-5">
                                            {t(
                                                "status",
                                                "Status"
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
                                    {filteredOrganizations.map(
                                        (org) => (
                                            <tr
                                                key={org.id}
                                                className="border-b border-slate-100 last:border-none hover:bg-blue-50/50 hover:shadow-[inset_2px_0_0_0_theme(colors.blue.400)] transition-all duration-300"
                                            >
                                                <td className="p-5 font-semibold text-slate-900">
                                                    {org.name}
                                                </td>

                                                <td className="p-5 text-sm text-slate-500">
                                                    {org.admin}
                                                </td>

                                                <td className="p-5 text-sm text-slate-500">
                                                    {org.employees}
                                                </td>

                                                <td className="p-5">
                                                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm">
                                                        {org.productive}%
                                                    </span>
                                                </td>

                                                <td className="p-5">
                                                    <StatusBadge
                                                        status={
                                                            org.status
                                                        }
                                                    />
                                                </td>

                                                <td className="p-5">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            to={`/super-admin/organizations/${org.id}`}
                                                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
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
                                                            className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shadow-sm transition-all duration-300 hover:bg-amber-100 hover:text-amber-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
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
                                                            className="p-2.5 rounded-xl bg-red-50 text-red-600 shadow-sm transition-all duration-300 hover:bg-red-100 hover:text-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
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
                        </div>

                        {/* Mobile stacked cards */}
                        <div className="md:hidden p-4 space-y-3">
                            {filteredOrganizations.map((org) => (
                                <div
                                    key={org.id}
                                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-blue-50/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-slate-900 truncate">
                                                {org.name}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-0.5 truncate">
                                                {org.admin}
                                            </p>
                                        </div>

                                        <StatusBadge
                                            status={org.status}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                                        <span>
                                            <span className="text-slate-400">
                                                {t(
                                                    "employees",
                                                    "Employees"
                                                )}
                                                :{" "}
                                            </span>
                                            {org.employees}
                                        </span>

                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm">
                                            {org.productive}%
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <Link
                                            to={`/super-admin/organizations/${org.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Eye size={16} />
                                            {t("view", "View")}
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setSelectedOrg(org);
                                                setEditOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium bg-amber-50 text-amber-600 shadow-sm transition-all duration-300 hover:bg-amber-100 hover:text-amber-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Pencil size={16} />
                                            {t("edit", "Edit")}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedOrg(org);
                                                setDeleteOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium bg-red-50 text-red-600 shadow-sm transition-all duration-300 hover:bg-red-100 hover:text-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Trash2 size={16} />
                                            {t("delete", "Delete")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex justify-center sm:justify-between items-center p-5 border-t border-slate-100 bg-white/60">
                    <p className="text-sm text-slate-500 text-center sm:text-left">
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
