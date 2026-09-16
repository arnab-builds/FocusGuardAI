import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductivityChart from "../../components/dashboard/ProductivityChart";
import TopWebsites from "../../components/dashboard/TopWebsites";
import RecentActivity from "../../components/dashboard/RecentActivity";
import StatsCards from "../../components/dashboard/StatsCards";
import AISummary from "../../components/dashboard/AISummary";
import {
  analyzeRecommendation,
} from "../../services/aiRecommendationService";
import { useLanguage } from "../../context/useLanguage";
import { setCache } from "../../utils/apiCache";

function Dashboard() {
  const { selectedDate, dashboardHeader, dashboardData, dashboardLoading } = useOutletContext();
  const { currentLanguageCode } = useLanguage();

  const { profile, analytics } = dashboardHeader;

  const recCacheKey = `emp-rec-${selectedDate}-${currentLanguageCode}`;

  const [manualRecommendation, setManualRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoadingRecommendation(true);

      const result = await analyzeRecommendation({
        range: "custom",
        start_date: selectedDate,
        end_date: selectedDate,
        language: currentLanguageCode,
      });

      setManualRecommendation({ date: selectedDate, value: result });
      setCache(recCacheKey, [result]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  // Pass safe fallback {} if analytics is null during first load
  const safeAnalytics = analytics || {};
  const safeProfile = profile || {};

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">

        {/* Statistics */}
        <StatsCards analytics={safeAnalytics} />

        {/* Charts + AI Summary */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="min-w-0 xl:col-span-2">
            <ProductivityChart
              activities={dashboardData.trend}
              selectedDate={selectedDate}
            />
          </div>

          <div className="min-w-0">
            <AISummary
              recommendation={
                manualRecommendation?.date === selectedDate
                  ? manualRecommendation.value
                  : dashboardData.recommendation
              }
              loading={loadingRecommendation || dashboardLoading}
              onAnalyze={handleAnalyze}
            />
          </div>

        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">

          <div className="min-w-0">
            <TopWebsites
              websiteSummary={safeAnalytics.website_summary || []}
            />
          </div>

          <div className="min-w-0">
            <RecentActivity
              activities={dashboardData.recent}
            />
          </div>

        </section>

      </div>
    </div>
  );
}

export default Dashboard;
