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

    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" && window.innerWidth < 640
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const totalEmployees = employeeData.reduce(
        (sum, entry) => sum + entry.value,
        0
    );

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                            {t("dashboard", "Dashboard")}
                        </h1>

                        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl">
                            {t(
                                "manage_organizations_monitor_platform_health",
                                "Manage organizations and monitor platform health."
                            )}
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 [&>*]:h-full [&>*]:rounded-2xl [&>*]:sm:rounded-3xl [&>*]:shadow-sm [&>*]:hover:shadow-xl [&>*]:hover:-translate-y-0.5 [&>*]:transition-all [&>*]:duration-300">
                    <StatCard
                        title={t("organizations", "Organizations")}
                        value={dashboard.stats.organizations}
                        icon={<Building2 size={28} />}
                        color="bg-blue-600"
                        cardClasses="border-blue-100/50 border-t-blue-500 from-blue-50/70 to-white"
                    />

                    <StatCard
                        title={t(
                            "organization_admins",
                            "Organization Admins"
                        )}
                        value={dashboard.stats.organization_admins}
                        icon={<UserCog size={28} />}
                        color="bg-indigo-600"
                        cardClasses="border-indigo-100/50 border-t-indigo-500 from-indigo-50/70 to-white"
                    />

                    <StatCard
                        title={t("employees", "Employees")}
                        value={dashboard.stats.employees}
                        icon={<Users size={28} />}
                        color="bg-green-600"
                        cardClasses="border-green-100/50 border-t-green-500 from-green-50/70 to-white"
                    />

                    <StatCard
                        title={t(
                            "pending_requests",
                            "Pending Requests"
                        )}
                        value={dashboard.stats.pending_requests}
                        icon={<FileClock size={28} />}
                        color="bg-red-500"
                        cardClasses="border-red-100/50 border-t-red-500 from-red-50/70 to-white"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                    <div className="rounded-2xl sm:rounded-3xl border border-blue-100/50 bg-gradient-to-br from-blue-50/70 to-white p-5 sm:p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-5 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                                {t("organization_growth", "Organization Growth")}
                            </h2>

                            <span className="text-xs sm:text-sm font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                                {t("organizations", "Organizations")}
                            </span>
                        </div>

                        <div className="w-full h-[250px] sm:h-[300px] lg:h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={dashboard.organization_growth}
                                    margin={{
                                        top: 5,
                                        right: 10,
                                        left: 0,
                                        bottom: isMobile ? 24 : 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#F1F5F9"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        tick={{
                                            fill: "#94A3B8",
                                            fontSize: isMobile ? 10 : 12,
                                        }}
                                        axisLine={{ stroke: "#E2E8F0" }}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                        angle={isMobile ? -35 : 0}
                                        textAnchor={isMobile ? "end" : "middle"}
                                        height={isMobile ? 40 : 30}
                                        tickMargin={isMobile ? 8 : 10}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: "#94A3B8",
                                            fontSize: isMobile ? 10 : 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={32}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid #E2E8F0",
                                            boxShadow:
                                                "0 10px 25px -5px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="employees"
                                        stroke="#2563EB"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#2563EB" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl sm:rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white p-5 sm:p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-5 sm:mb-6">
                            {t("employee_distribution", "Employee Distribution")}
                        </h2>

                        {totalEmployees === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center h-[250px] sm:h-[300px] lg:h-[340px]">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
                                    <Users size={28} strokeWidth={1.5} />
                                </div>

                                <p className="text-sm font-medium text-slate-500">
                                    {t(
                                        "no_employee_data",
                                        "No employee data yet."
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[340px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart
                                        margin={{
                                            top: 5,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <Pie
                                            data={employeeData}
                                            dataKey="value"
                                            cx="50%"
                                            cy={isMobile ? "42%" : "45%"}
                                            innerRadius={isMobile ? "42%" : "50%"}
                                            outerRadius={isMobile ? "62%" : "72%"}
                                            paddingAngle={3}
                                            cornerRadius={4}
                                            labelLine={false}
                                            label={({ percent }) =>
                                                percent > 0.05
                                                    ? `${(percent * 100).toFixed(0)}%`
                                                    : ""
                                            }
                                        >
                                            {employeeData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={COLORS[index]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "12px",
                                                border: "1px solid #E2E8F0",
                                                boxShadow:
                                                    "0 10px 25px -5px rgba(0,0,0,0.1)",
                                            }}
                                        />

                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{
                                                fontSize: isMobile
                                                    ? "11px"
                                                    : "13px",
                                                color: "#64748B",
                                                paddingTop: "8px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div
                                    className="pointer-events-none absolute left-1/2 flex flex-col items-center"
                                    style={{
                                        top: isMobile ? "42%" : "45%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums leading-tight">
                                        {totalEmployees}
                                    </span>
                                    <span className="text-[10px] sm:text-xs font-medium text-slate-400 leading-tight">
                                        {t("employees", "Employees")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
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