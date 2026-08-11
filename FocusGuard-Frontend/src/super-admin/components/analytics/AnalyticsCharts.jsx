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

import { Building2, Users, TrendingUp, TrendingDown, BarChart3, Loader2 } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { getAnalytics } from "../../services/superAdminService";

function truncateLabel(value) {
    if (typeof value !== "string") return value;
    return value.length > 10 ? `${value.slice(0, 10)}…` : value;
}

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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 sm:p-16 flex flex-col items-center justify-center text-center">
                <Loader2 className="animate-spin text-blue-600" size={36} />

                <p className="mt-5 text-base font-semibold text-slate-700">
                    {t(
                        "loading_analytics",
                        "Loading analytics..."
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-blue-100/50 border-t-[3px] border-t-blue-500 bg-gradient-to-br from-blue-50/70 to-white shadow-sm p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 text-blue-600 ring-1 ring-blue-100">
                        <Building2 size={26} />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">
                            {t(
                                "organizations",
                                "Organizations"
                            )}
                        </h3>

                        <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                            {summary.organizations}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-indigo-100/50 border-t-[3px] border-t-indigo-500 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 text-indigo-600 ring-1 ring-indigo-100">
                        <Users size={26} />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">
                            {t(
                                "employees",
                                "Employees"
                            )}
                        </h3>

                        <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                            {summary.employees}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-emerald-100/50 border-t-[3px] border-t-emerald-500 bg-gradient-to-br from-emerald-50/70 to-white shadow-sm p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 text-emerald-600 ring-1 ring-emerald-100">
                        <TrendingUp size={26} />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">
                            {t(
                                "productive",
                                "Productive"
                            )}
                        </h3>

                        <p className="text-3xl sm:text-4xl font-bold text-emerald-600 mt-1">
                            {summary.productive}%
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-red-100/50 border-t-[3px] border-t-red-500 bg-gradient-to-br from-red-50/70 to-white shadow-sm p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/70 text-red-600 ring-1 ring-red-100">
                        <TrendingDown size={26} />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">
                            {t(
                                "non_productive",
                                "Non Productive"
                            )}
                        </h3>

                        <p className="text-3xl sm:text-4xl font-bold text-red-600 mt-1">
                            {summary.non_productive}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
                    <h2 className="font-semibold text-lg sm:text-xl text-slate-900 mb-6">
                        {t(
                            "employees_per_organization",
                            "Employees per Organization"
                        )}
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >
                        <AreaChart
                            data={growth}
                            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                tickFormatter={truncateLabel}
                                angle={-15}
                                textAnchor="end"
                                height={50}
                                interval={0}
                            />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
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

                <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
                    <h2 className="font-semibold text-lg sm:text-xl text-slate-900 mb-6">
                        {t(
                            "organization_productivity",
                            "Organization Productivity"
                        )}
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >
                        <BarChart
                            data={productivity}
                            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                tickFormatter={truncateLabel}
                                angle={-15}
                                textAnchor="end"
                                height={50}
                                interval={0}
                            />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
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

            <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-6 sm:p-8 pb-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                        {t(
                            "organization_analytics",
                            "Organization Analytics"
                        )}
                    </h2>
                </div>

                {organizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-300 ring-1 ring-blue-100 mb-4">
                            <BarChart3 size={28} strokeWidth={1.5} />
                        </div>

                        <p className="text-base font-semibold text-slate-600">
                            {t("no_organization_data_found")}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop / tablet table */}
                        <div className="hidden md:block overflow-x-auto p-6 sm:p-8 pt-4">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-indigo-50/50 border-b border-indigo-100">
                                        <th className="p-4 text-left rounded-l-xl">
                                            {t(
                                                "organization",
                                                "Organization"
                                            )}
                                        </th>

                                        <th className="p-4 text-center">
                                            {t(
                                                "employees",
                                                "Employees"
                                            )}
                                        </th>

                                        <th className="p-4 text-center">
                                            {t(
                                                "productive",
                                                "Productive"
                                            )}
                                        </th>

                                        <th className="p-4 text-center">
                                            {t(
                                                "non_productive",
                                                "Non Productive"
                                            )}
                                        </th>

                                        <th className="p-4 text-center rounded-r-xl">
                                            {t(
                                                "neutral",
                                                "Neutral"
                                            )}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {organizations.map((org, index) => (
                                        <tr
                                            key={org.organization_id}
                                            className={`border-b border-slate-100 last:border-none hover:bg-blue-50/40 transition-all duration-300 ${
                                                index % 2 === 1
                                                    ? "bg-slate-50/40"
                                                    : ""
                                            }`}
                                        >
                                            <td className="p-4 font-semibold text-slate-900">
                                                {org.organization}
                                            </td>

                                            <td className="p-4 text-center text-slate-600">
                                                {org.employees}
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm">
                                                    {org.productive}%
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-200/70 shadow-sm">
                                                    {org.non_productive}%
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-50 to-amber-100/70 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200/70 shadow-sm">
                                                    {org.neutral}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile stacked cards */}
                        <div className="md:hidden p-4 space-y-3">
                            {organizations.map((org) => (
                                <div
                                    key={org.organization_id}
                                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {org.organization}
                                        </h3>

                                        <span className="text-sm text-slate-500 shrink-0">
                                            {org.employees}{" "}
                                            {t(
                                                "employees",
                                                "Employees"
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm">
                                            {t(
                                                "productive",
                                                "Productive"
                                            )}
                                            : {org.productive}%
                                        </span>

                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-200/70 shadow-sm">
                                            {t(
                                                "non_productive",
                                                "Non Productive"
                                            )}
                                            : {org.non_productive}%
                                        </span>

                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-50 to-amber-100/70 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200/70 shadow-sm">
                                            {t(
                                                "neutral",
                                                "Neutral"
                                            )}
                                            : {org.neutral}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AnalyticsCharts;
