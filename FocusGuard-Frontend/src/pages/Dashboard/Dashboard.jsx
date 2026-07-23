import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductivityChart from "../../components/dashboard/ProductivityChart";
import TopWebsites from "../../components/dashboard/TopWebsites";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { getProfile } from "../../services/profileService";
import { getAnalytics } from "../../services/analyticsService";
import { getActivityHistory } from "../../services/activityService";
import StatsCards from "../../components/dashboard/StatsCards";
import AISummary from "../../components/dashboard/AISummary";
import {
  analyzeRecommendation,
  getAIRecommendations,
} from "../../services/aiRecommendationService";
import { getDashboardTrend } from "../../services/dashboardService";
const getTodayInputValue = () => {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

function Dashboard() {
const {
  selectedDate,
  setDashboardHeader,
} = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
const [trendActivities, setTrendActivities] = useState([]);
const [recentActivities, setRecentActivities] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
const [loadingRecommendation, setLoadingRecommendation] = useState(false);
const getRange = (selectedDate) => {
  const today = new Date();

  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const selected = new Date(selectedDate);

  const diff = Math.floor(
    (current - selected) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return { range: "today" };
  if (diff === 1) return { range: "yesterday" };
  if (diff <= 7) return { range: "last_week" };
  if (diff <= 30) return { range: "last_month" };

  return {
    range: "custom",
    start_date: selectedDate,
    end_date: selectedDate,
  };
};

const handleAnalyze = async () => {
  try {
    setLoadingRecommendation(true);

    const result = await analyzeRecommendation({
      range: "custom",
      start_date: selectedDate,
      end_date: selectedDate,
    });

    setRecommendation(result);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingRecommendation(false);
  }
};

  useEffect(() => {
    const fetchData = async () => {
  try {
    const profileData = await getProfile();
    const analyticsData = await getAnalytics(selectedDate);

    setProfile(profileData);
    setAnalytics(analyticsData);

    const trendData = await getDashboardTrend(selectedDate);
setTrendActivities(trendData);

const recentData = await getActivityHistory(1, selectedDate);
setRecentActivities(recentData.results || []);
    } catch (err) {
      console.error("Activity API Error:", err);
      setActivities([]);
    }

    try {
      const latestRecommendation = await getAIRecommendations();

      if (latestRecommendation.length > 0) {
        setRecommendation(latestRecommendation[0]);
      }
    } catch (err) {
      console.error("Recommendation API Error:", err);
    }
  };
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    setDashboardHeader({
    profile,
    analytics,
});
  }, [analytics, profile, selectedDate, setDashboardHeader]);

 

  if (!profile || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        Loading...
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
          <TopWebsites websiteSummary={analytics.website_summary} />

          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
