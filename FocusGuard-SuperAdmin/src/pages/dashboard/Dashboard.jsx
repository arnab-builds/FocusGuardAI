import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/ui/StatCard";
import RecentOrganizations from "../../components/dashboard/RecentOrganizations";
import PendingInvitations from "../../components/dashboard/PendingInvitations";

import {
    Building2,
    Users,
    UserCog,
    FileClock,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import { useLanguage } from "../../context/useLanguage";

import { getDashboard } from "../../services/superAdminService";

const COLORS = [
    "#2563EB",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
];

function Dashboard() {
    const { t } = useLanguage();

    const [dashboard, setDashboard] = useState({
        stats: {
            organizations: 0,
            organization_admins: 0,
            employees: 0,
            pending_requests: 0,
        },
        organization_growth: [],
        employee_distribution: {},
        recent_organizations: [],
        pending_invitations: [],
    });

    const loadDashboard = async () => {
        try {
            console.log("Calling Dashboard API...");

            const response = await getDashboard();

            console.log("Dashboard Response:", response);
            console.log("Dashboard Data:", response.data);

            setDashboard(response.data);
        } catch (error) {
            console.error("Dashboard Error:", error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
                console.log("Headers:", error.response.headers);
            } else if (error.request) {
                console.log("No response received:", error.request);
            } else {
                console.log("Error:", error.message);
            }
        }
    };

    useEffect(() => {
        console.log("ACCESS TOKEN:", localStorage.getItem("access"));
        console.log("USER:", localStorage.getItem("user"));

        loadDashboard();
    }, []);

    const employeeData = [
        {
            name: t("active", "Active"),
            value: dashboard.employee_distribution.active || 0,
        },
        {
            name: t("inactive", "Inactive"),
            value: dashboard.employee_distribution.inactive || 0,
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        {t("dashboard", "Dashboard")}
                    </h1>

                    <p className="text-slate-500 mt-2">
                        {t(
                            "manage_organizations_monitor_platform_health",
                            "Manage organizations and monitor platform health."
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    <StatCard
                        title={t("organizations", "Organizations")}
                        value={dashboard.stats.organizations}
                        icon={<Building2 size={28} />}
                        color="bg-blue-600"
                    />

                    <StatCard
                        title={t(
                            "organization_admins",
                            "Organization Admins"
                        )}
                        value={dashboard.stats.organization_admins}
                        icon={<UserCog size={28} />}
                        color="bg-indigo-600"
                    />

                    <StatCard
                        title={t("employees", "Employees")}
                        value={dashboard.stats.employees}
                        icon={<Users size={28} />}
                        color="bg-green-600"
                    />

                    <StatCard
                        title={t(
                            "pending_requests",
                            "Pending Requests"
                        )}
                        value={dashboard.stats.pending_requests}
                        icon={<FileClock size={28} />}
                        color="bg-red-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                {t(
                                    "organization_growth",
                                    "Organization Growth"
                                )}
                            </h2>

                            <span className="text-sm text-gray-500">
                                {t(
                                    "organizations",
                                    "Organizations"
                                )}
                            </span>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboard.organization_growth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="employees"
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            {t(
                                "employee_distribution",
                                "Employee Distribution"
                            )}
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={employeeData}
                                    dataKey="value"
                                    outerRadius={100}
                                    label
                                >
                                    {employeeData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />

                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <RecentOrganizations
                        organizations={dashboard.recent_organizations}
                    />

                    <PendingInvitations
                        invitations={dashboard.pending_invitations}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;