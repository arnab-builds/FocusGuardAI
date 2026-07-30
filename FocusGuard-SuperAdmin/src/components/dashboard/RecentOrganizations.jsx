import { Link } from "react-router-dom";

import { useLanguage } from "../../context/useLanguage";

import StatusBadge from "../ui/StatusBadge";

function RecentOrganizations({
    organizations = [],
}) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    {t(
                        "recent_organizations",
                        "Recent Organizations"
                    )}
                </h2>

                <button className="text-blue-600 font-semibold hover:underline">
                    {t(
                        "view_all",
                        "View All"
                    )}
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b text-left text-gray-500">
                        <th className="pb-4">
                            {t(
                                "organization",
                                "Organization"
                            )}
                        </th>

                        <th className="pb-4">
                            {t(
                                "created",
                                "Created"
                            )}
                        </th>

                        <th className="pb-4">
                            {t(
                                "status",
                                "Status"
                            )}
                        </th>

                        <th className="pb-4 text-right">
                            {t(
                                "action",
                                "Action"
                            )}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {organizations.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                className="py-10 text-center text-gray-500"
                            >
                                {t(
                                    "no_organizations_found",
                                    "No organizations found."
                                )}
                            </td>
                        </tr>
                    ) : (
                        organizations.map((organization) => (
                            <tr
                                key={organization.id}
                                className="border-b last:border-none"
                            >
                                <td className="py-5 font-medium">
                                    {organization.name}
                                </td>

                                <td>
                                    {new Date(
                                        organization.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td>
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

                                <td className="text-right">
                                    <Link
                                        to={`/organizations/${organization.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {t(
                                            "view",
                                            "View"
                                        )}
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RecentOrganizations;