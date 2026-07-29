import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";

import DashboardCards from "../components/dashboard/DashboardCards";
import ActivityChart from "../components/dashboard/ActivityChart";
import TopPerformers from "../components/dashboard/TopPerformers";
import AttentionEmployees from "../components/dashboard/AttentionEmployees";
import RecentActivities from "../components/dashboard/RecentActivities";

import {
    getOrganizationAnalytics,
    getDashboardTrend,
    getOrganizationActivity,
    getOrganizationMembers,
} from "../services/dashboardService";
import { normalizeOrganizationActivities } from "../utils/activityUtils";
import { useLanguage } from "../context/useLanguage";

const initialAnalytics = {
    total_employees: 0,
    active_employees: 0,
    inactive_employees: 0,
    productive_percentage: 0,
    unproductive_percentage: 0,
};

function Dashboard() {
    const { t } = useLanguage();

    const [analytics, setAnalytics] = useState(initialAnalytics);

    const [trend, setTrend] = useState([]);

    const [activities, setActivities] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [lastSynced, setLastSynced] = useState(null);

    const loadDashboard = async () => {
        try {
            const [
                analyticsResponse,
                trendResponse,
                activityResponse,
                membersResponse,
            ] = await Promise.all([
                getOrganizationAnalytics(),
                getDashboardTrend(),
                getOrganizationActivity(),
                getOrganizationMembers(),
            ]);

            setAnalytics(
                analyticsResponse || initialAnalytics
            );

            setTrend(
                Array.isArray(trendResponse)
                    ? trendResponse
                    : []
            );

            setActivities(
                normalizeOrganizationActivities(
                    activityResponse
                )
            );

            setEmployees(
                Array.isArray(membersResponse)
                    ? membersResponse
                    : membersResponse?.members ||
                          membersResponse?.users ||
                          membersResponse?.results ||
                          []
            );

            setLastSynced(new Date());

            setError("");
        } catch (loadError) {
            console.error(loadError);

            setError(
                t(
                    "dashboard_refresh_failed",
                    "Dashboard data could not be refreshed."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(
            loadDashboard,
            0
        );

        return () => clearTimeout(timeout);
    }, []);

    const syncedLabel = lastSynced
        ? lastSynced.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
          })
        : t(
              "not_synced_yet",
              "Not synced yet"
          );

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1500px] space-y-7">
                <PageHeader
                    title={t(
                        "dashboard",
                        "Dashboard"
                    )}
                    subtitle={t(
                        "organization_overview",
                        "Organization overview"
                    )}
                    action={
                        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                            <span className="font-semibold text-slate-700">
                                {t(
                                    "last_synced",
                                    "Last synced"
                                )}
                                :
                            </span>{" "}
                            {syncedLabel}
                        </div>
                    }
                />

                {error && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-36 animate-pulse rounded-[18px] border border-slate-200 bg-white"
                                />
                            )
                        )}
                    </div>
                ) : (
                    <DashboardCards
                        analytics={analytics}
                    />
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {loading ? (
                        <>
                            <div className="h-[360px] animate-pulse rounded-[18px] border border-slate-200 bg-white" />
                            <div className="h-[360px] animate-pulse rounded-[18px] border border-slate-200 bg-white" />
                        </>
                    ) : (
                        <>
                            <TopPerformers
                                employees={
                                    employees
                                }
                            />
                            <AttentionEmployees
                                employees={
                                    employees
                                }
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,.65fr)]">
                    {loading ? (
                        <>
                            <div className="h-[420px] animate-pulse rounded-[18px] border border-slate-200 bg-white" />
                            <div className="h-[420px] animate-pulse rounded-[18px] border border-slate-200 bg-white" />
                        </>
                    ) : (
                        <>
                            <ActivityChart
                                data={trend}
                            />
                            <RecentActivities
                                activities={
                                    activities
                                }
                            />
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;