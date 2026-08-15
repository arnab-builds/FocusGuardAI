import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getAnalytics } from "../../services/analyticsService";

import SummaryCards from "../../components/analytics/SummaryCards";
import ProductivityPieChart from "../../components/analytics/ProductivityPieChart";
import CategoryBarChart from "../../components/analytics/CategoryBarChart";
import WebsiteTable from "../../components/analytics/WebsiteTable";
import { useLanguage } from "../../context/useLanguage";

export default function Analytics() {
  const { selectedDate, setDashboardHeader } = useOutletContext();
  const { t } = useLanguage();

  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const data = await getAnalytics(selectedDate);

      setAnalytics(data);

      setDashboardHeader((prev) => ({
        ...prev,
        analytics: data,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-lg font-medium text-slate-600 dark:text-slate-400 shadow-sm">
        {t("loading_analytics", "Loading Analytics...")}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
            {t("analytics", "Analytics")}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            {t(
              "detailed_productivity_insights",
              "Detailed productivity insights."
            )}
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards analytics={analytics} />

        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="min-w-0">
            <ProductivityPieChart analytics={analytics} />
          </div>

          <div className="min-w-0">
            <CategoryBarChart analytics={analytics} />
          </div>
        </section>

        {/* Website Table */}
        <section className="min-w-0">
          <WebsiteTable analytics={analytics} />
        </section>

      </div>
    </div>
  );
}
