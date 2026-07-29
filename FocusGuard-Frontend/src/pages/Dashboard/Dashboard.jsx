import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductivityChart from "../../components/dashboard/ProductivityChart";
import TopWebsites from "../../components/dashboard/TopWebsites";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { getActivityHistory } from "../../services/activityService";
import StatsCards from "../../components/dashboard/StatsCards";
import AISummary from "../../components/dashboard/AISummary";
import {
  analyzeRecommendation,
} from "../../services/aiRecommendationService";
import { getDashboardTrend } from "../../services/dashboardService";
import { useLanguage } from "../../context/useLanguage";

function Dashboard() {
  const { selectedDate, dashboardHeader } = useOutletContext();
  const { t, currentLanguageCode } = useLanguage();

  const { profile, analytics } = dashboardHeader;
  const [trendActivities, setTrendActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        {t("loading", "Loading...")}
      </div>
    );
  }

  return (
    <div className="bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6">
        <StatsCards analytics={analytics} />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ProductivityChart
              activities={trendActivities}
              selectedDate={selectedDate}
            />
          </div>

          <div>
            <AISummary
              recommendation={recommendation}
              loading={loadingRecommendation}
              onAnalyze={handleAnalyze}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TopWebsites
            websiteSummary={analytics.website_summary}
          />

          <RecentActivity
            activities={recentActivities}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
