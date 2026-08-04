import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductivityChart from "../../components/dashboard/ProductivityChart";
import TopWebsites from "../../components/dashboard/TopWebsites";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { getActivityHistory } from "../../services/activityService";
import StatsCards from "../../components/dashboard/StatsCards";
import AISummary from "../../components/dashboard/AISummary";
import { analyzeRecommendation } from "../../services/aiRecommendationService";
import { getDashboardTrend } from "../../services/dashboardService";
import { useLanguage } from "../../context/useLanguage";

function Dashboard() {
  const { selectedDate, dashboardHeader } = useOutletContext();
  const { t, currentLanguageCode } = useLanguage();

  const { profile, analytics } = dashboardHeader;

  const [trendActivities, setTrendActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
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

      setRecommendation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [trendData, recentData] = await Promise.all([
          getDashboardTrend(selectedDate, controller.signal),
          getActivityHistory(1, selectedDate, controller.signal),
        ]);

        if (controller.signal.aborted) return;

        setTrendActivities(trendData);
        setRecentActivities(recentData.results || []);
      } catch (err) {
        if (err.name === "CanceledError") return;

        console.error("Activity API Error:", err);
        setTrendActivities([]);
        setRecentActivities([]);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [selectedDate]);

  if (!profile || !analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl bg-white text-lg font-medium text-slate-600 shadow-sm">
        {t("loading", "Loading...")}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6">

        {/* Statistics */}
        <StatsCards analytics={analytics} />

        {/* Charts + AI Summary */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="min-w-0 xl:col-span-2">
            <ProductivityChart
              activities={trendActivities}
              selectedDate={selectedDate}
            />
          </div>

          <div className="min-w-0">
            <AISummary
              recommendation={recommendation}
              loading={loadingRecommendation}
              onAnalyze={handleAnalyze}
            />
          </div>

        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">

          <div className="min-w-0">
            <TopWebsites
              websiteSummary={analytics.website_summary}
            />
          </div>

          <div className="min-w-0">
            <RecentActivity
              activities={recentActivities}
            />
          </div>

        </section>

      </div>
    </div>
  );
}

export default Dashboard;