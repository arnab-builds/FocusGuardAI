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
  getAIRecommendations,
} from "../../services/aiRecommendationService";
import { getDashboardTrend } from "../../services/dashboardService";
import { useLanguage } from "../../context/useLanguage";
import { fetchWithCache, getCache } from "../../utils/apiCache";

function Dashboard() {
  const { selectedDate, dashboardHeader } = useOutletContext();
  const { t, currentLanguageCode } = useLanguage();

  const { profile, analytics } = dashboardHeader;

  const trendCacheKey = `emp-trend-${selectedDate}-${currentLanguageCode}`;
  const recentCacheKey = `emp-recent-${selectedDate}-${currentLanguageCode}`;
  const recCacheKey = `emp-rec-${selectedDate}-${currentLanguageCode}`;

  const [trendActivities, setTrendActivities] = useState(() => getCache(trendCacheKey) || []);
  const [recentActivities, setRecentActivities] = useState(() => getCache(recentCacheKey)?.results || []);
  const [recommendation, setRecommendation] = useState(() => getCache(recCacheKey) || null);
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
    let isCurrent = true;

    const loadRecommendation = async () => {
      try {
        const recommendations = await fetchWithCache(recCacheKey, () => getAIRecommendations(
          selectedDate,
          currentLanguageCode
        ));

        if (isCurrent) {
          setRecommendation(recommendations[0] || null);
        }
      } catch (error) {
        if (isCurrent) {
          console.error("Recommendation API Error:", error);
          setRecommendation(null);
        }
      }
    };

    loadRecommendation();

    return () => {
      isCurrent = false;
    };
  }, [selectedDate, currentLanguageCode, recCacheKey]);

  useEffect(() => {
    let isCurrent = true;

    const fetchData = async () => {
      try {
        const [trendData, recentData] = await Promise.all([
          fetchWithCache(trendCacheKey, () => getDashboardTrend(selectedDate)),
          fetchWithCache(recentCacheKey, () => getActivityHistory(1, selectedDate)),
        ]);

        if (isCurrent) {
          setTrendActivities(trendData);
          setRecentActivities(recentData.results || []);
        }
      } catch (err) {
        if (isCurrent) {
          console.error("Activity API Error:", err);
          setTrendActivities([]);
          setRecentActivities([]);
        }
      }
    };

    fetchData();

    const refreshInterval = window.setInterval(() => {
      if (!document.hidden) {
        fetchData();
      }
    }, 30_000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isCurrent = false;
      window.clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedDate, trendCacheKey, recentCacheKey]);

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
              websiteSummary={safeAnalytics.website_summary || []}
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
