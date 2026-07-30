import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from "recharts";

import { useLanguage } from "../../context/useLanguage";

import { getAnalytics } from "../../services/superAdminService";

function AnalyticsCharts() {
    const { t } = useLanguage();

    const [summary, setSummary] = useState({});
    const [organizations, setOrganizations] =
        useState([]);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        try {
            setLoading(true);

            const res = await getAnalytics();

            setSummary(res.data.summary);

            setOrganizations(
                res.data.organizations_data
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const growth = organizations.map((org) => ({
        month: org.organization,
        users: org.employees,
    }));

    const productivity = organizations.map(
        (org) => ({
            name: org.organization,
            score: org.productive,
        })
    );

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border p-10 text-center">
                {t(
                    "loading_analytics",
                    "Loading analytics..."
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="text-gray-500">
                        {t(
                            "organizations",
                            "Organizations"
                        )}
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        {summary.organizations}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="text-gray-500">
                        {t(
                            "employees",
                            "Employees"
                        )}
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        {summary.employees}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="text-gray-500">
                        {t(
                            "productive",
                            "Productive"
                        )}
                    </h3>

                    <p className="text-4xl font-bold text-green-600 mt-3">
                        {summary.productive}%
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="text-gray-500">
                        {t(
                            "non_productive",
                            "Non Productive"
                        )}
                    </h3>

                    <p className="text-4xl font-bold text-red-600 mt-3">
                        {summary.non_productive}%
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h2 className="font-semibold text-xl mb-6">
                        {t(
                            "employees_per_organization",
                            "Employees per Organization"
                        )}
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >
                        <AreaChart data={growth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#2563eb"
                                fill="#93c5fd"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h2 className="font-semibold text-xl mb-6">
                        {t(
                            "organization_productivity",
                            "Organization Productivity"
                        )}
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >
                        <BarChart data={productivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="score"
                                fill="#2563eb"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">
                    {t(
                        "organization_analytics",
                        "Organization Analytics"
                    )}
                </h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                            <th className="p-4 text-left">
                                {t(
                                    "organization",
                                    "Organization"
                                )}
                            </th>

                            <th className="text-center">
                                {t(
                                    "employees",
                                    "Employees"
                                )}
                            </th>

                            <th className="text-center">
                                {t(
                                    "productive",
                                    "Productive"
                                )}
                            </th>

                            <th className="text-center">
                                {t(
                                    "non_productive",
                                    "Non Productive"
                                )}
                            </th>

                            <th className="text-center">
                                {t(
                                    "neutral",
                                    "Neutral"
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {organizations.map((org) => (
                            <tr
                                key={org.organization_id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-4 font-semibold">
                                    {org.organization}
                                </td>

                                <td className="text-center">
                                    {org.employees}
                                </td>

                                <td className="text-center text-green-600 font-semibold">
                                    {org.productive}%
                                </td>

                                <td className="text-center text-red-600 font-semibold">
                                    {org.non_productive}%
                                </td>

                                <td className="text-center text-yellow-600 font-semibold">
                                    {org.neutral}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AnalyticsCharts;