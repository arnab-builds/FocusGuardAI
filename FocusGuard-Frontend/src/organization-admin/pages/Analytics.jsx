import { useEffect, useState } from "react";


import PageHeader from "../components/common/PageHeader";
import AnalyticsOverview from "../components/analytics/AnalyticsOverview";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import CategoryChart from "../components/analytics/CategoryChart";
import TopWebsites from "../components/analytics/TopWebsites";

import { useLanguage } from "../context/useLanguage";

import {
    getOrganizationAnalytics,
} from "../services/analyticsService";
import { getApiErrorMessage } from "../utils/responseUtils";
import { fetchWithCache, getCache } from "../../utils/apiCache";

const durationToSeconds = (duration) => {
    if (!duration) {
        return 0;
    }

    const parts = String(duration).split(":");

    if (parts.length !== 3) {
        return 0;
    }

    return (
        Number(parts[0]) * 3600 +
        Number(parts[1]) * 60 +
        Number(parts[2])
    );
};

const buildCategoryData = (analytics) => {
    const totals = {};

    // Newer organization responses provide this already aggregated by the
    // database, avoiding a large per-member payload and client-side loop.
    if (analytics.category_summary) {
        Object.entries(analytics.category_summary).forEach(([category, duration]) => {
            totals[category] = durationToSeconds(duration);
        });
        return Object.entries(totals).map(([name, seconds]) => ({
            name,
            value: Math.round(seconds / 60),
        }));
    }

    (analytics.members || analytics.users || []).forEach((member) => {
        Object.entries(member.category_summary || {}).forEach(
            ([category, duration]) => {
                totals[category] =
                    (totals[category] || 0) +
                    durationToSeconds(duration);
            }
        );
    });

    return Object.entries(totals).map(([name, seconds]) => ({
        name,
        value: Math.round(seconds / 60),
    }));
};

function Analytics() {
    const { currentLanguageCode, t } = useLanguage();

    const cacheKey = `org-analytics-${currentLanguageCode}`;

    const [analytics, setAnalytics] = useState(() => getCache(cacheKey) || {
        total_employees: 0,
        active_employees: 0,
        inactive_employees: 0,
        productive_percentage: 0,
        unproductive_percentage: 0,
    });

    const [categoryData, setCategoryData] = useState(() => getCache(cacheKey) ? buildCategoryData(getCache(cacheKey)) : []);
    const [error, setError] = useState("");

    async function loadAnalytics() {
        try {
            const analyticsResponse = await fetchWithCache(cacheKey, () => getOrganizationAnalytics(currentLanguageCode));

            setAnalytics(analyticsResponse);
            setCategoryData(buildCategoryData(analyticsResponse));
            setError("");
        } catch (error) {
            console.error(error);
            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "analytics_load_failed",
                        "Analytics could not be loaded."
                    )
                )
            );
        }
    }

    useEffect(() => {
        loadAnalytics();
    }, [currentLanguageCode]);

    return (
            <div className="space-y-8">
                <PageHeader
    title={t(
        "analytics_dashboard",
        "Analytics Dashboard"
    )}
    subtitle={t(
        "analytics_dashboard_subtitle",
        "Monitor productivity trends, employee performance, website usage, and organizational insights."
    )}
/>

                <AnalyticsOverview
                    analytics={analytics}
                />

                {error && (
                    <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <ProductivityChart
                        data={[
                            {
                                name: t(
                                    "productive",
                                    "Productive"
                                ),
                                value:
                                    analytics.productive_percentage ||
                                    0,
                            },
                            {
                                name: t(
                                    "unproductive",
                                    "Unproductive"
                                ),
                                value:
                                    analytics.unproductive_percentage ||
                                    0,
                            },
                        ]}
                    />

                    <CategoryChart
                        data={categoryData}
                    />
                </div>

                <TopWebsites
                    websites={
                        analytics.top_websites ||
                        []
                    }
                />
            </div>
    );
}

export default Analytics;
