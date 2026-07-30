import { useLanguage } from "../../context/useLanguage";

import AdminLayout from "../../components/layout/AdminLayout";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

function Analytics() {
    const { t } = useLanguage();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("analytics", "Analytics")}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {t(
                            "platform_analytics_overview",
                            "Platform analytics overview."
                        )}
                    </p>
                </div>

                <AnalyticsCharts />
            </div>
        </AdminLayout>
    );
}

export default Analytics;