import { Link } from "react-router-dom";

import { Building2 } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import StatusBadge from "../ui/StatusBadge";

function RecentOrganizations({
    organizations = [],
}) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-100 p-5 sm:p-6 lg:p-7 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {t(
                        "recent_organizations",
                        "Recent Organizations"
                    )}
                </h2>

                <button className="self-start sm:self-auto text-sm font-semibold text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300">
                    {t(
                        "view_all",
                        "View All"
                    )}
                </button>
            </div>

            {organizations.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
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
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <th className="pb-3 px-3 lg:px-4">
                                        {t(
                                            "organization",
                                            "Organization"
                                        )}
                                    </th>

                                    <th className="pb-3 px-3 lg:px-4">
                                        {t(
                                            "created",
                                            "Created"
                                        )}
                                    </th>

                                    <th className="pb-3 px-3 lg:px-4">
                                        {t(
                                            "status",
                                            "Status"
                                        )}
                                    </th>

                                    <th className="pb-3 px-3 lg:px-4 text-right">
                                        {t(
                                            "action",
                                            "Action"
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {organizations.map((organization) => (
                                    <tr
                                        key={organization.id}
                                        className="rounded-xl hover:bg-slate-50 transition-all duration-300"
                                    >
                                        <td className="py-4 px-3 lg:px-4 font-medium text-slate-900 rounded-l-xl">
                                            {organization.name}
                                        </td>

                                        <td className="py-4 px-3 lg:px-4 text-sm text-slate-500">
                                            {new Date(
                                                organization.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="py-4 px-3 lg:px-4">
                                            <StatusBadge
                                                status={
                                                    organization.status
                                                        ? t(
                                                              "active",
                                                              "Active"
                                                          )
                                                        : t(
                                                              "inactive",
                                                              "Inactive"
                                                          )
                                                }
                                            />
                                        </td>

                                        <td className="py-4 px-3 lg:px-4 text-right rounded-r-xl">
                                            <Link
                                                to={`/super-admin/organizations/${organization.id}`}
                                                className="text-blue-600 font-medium text-sm hover:underline transition-all duration-300"
                                            >
                                                {t(
                                                    "view",
                                                    "View"
                                                )}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="md:hidden space-y-3">
                        {organizations.map((organization) => (
                            <div
                                key={organization.id}
                                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {organization.name}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {new Date(
                                                organization.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <StatusBadge
                                        status={
                                            organization.status
                                                ? t(
                                                      "active",
                                                      "Active"
                                                  )
                                                : t(
                                                      "inactive",
                                                      "Inactive"
                                                  )
                                        }
                                    />
                                </div>

                                <Link
                                    to={`/super-admin/organizations/${organization.id}`}
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-blue-600 text-blue-600 text-sm font-semibold py-2 hover:bg-blue-50 transition-all duration-300"
                                >
                                    {t(
                                        "view",
                                        "View"
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default RecentOrganizations;
