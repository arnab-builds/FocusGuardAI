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

  const [analytics, setAnalytics] = useState(null);
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
      <div className="flex h-screen items-center justify-center text-lg">
        {t("loading_analytics", "Loading Analytics...")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">
        {t("analytics", "Analytics")}
      </h1>

      <p className="mb-8 text-gray-500">
        {t(
          "detailed_productivity_insights",
          "Detailed productivity insights."
        )}
      </p>

      <SummaryCards analytics={analytics} />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ProductivityPieChart analytics={analytics} />
        <CategoryBarChart analytics={analytics} />
      </div>

      <div className="mt-8">
        <WebsiteTable analytics={analytics} />
      </div>
    </div>
  );
}