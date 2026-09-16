import { Outlet } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { getProfile } from "../services/profileService";
import { getAnalytics } from "../services/analyticsService";
import { getActivityHistory } from "../services/activityService";
import { getDashboardTrend } from "../services/dashboardService";
import { getAIRecommendations } from "../services/aiRecommendationService";
import { useTheme } from "../context/ThemeContext";
import { fetchWithCache, getCache } from "../utils/apiCache";

import { useLanguage } from "../context/useLanguage";

const getTodayInputValue = () => {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().slice(0, 10);
};

function DashboardLayoutContent() {
  const [selectedDate, setSelectedDate] = useState(getTodayInputValue());
  const isFollowingToday = useRef(true);
  const { currentLanguageCode } = useLanguage();

  const profileCacheKey = `emp-profile-${currentLanguageCode}`;
  const analyticsCacheKey = `emp-analytics-${selectedDate}-${currentLanguageCode}`;

  const [dashboardHeader, setDashboardHeader] = useState(() => ({
    profile: getCache(profileCacheKey) || null,
    analytics: getCache(analyticsCacheKey) || null,
  }));
  const [dashboardData, setDashboardData] = useState(() => ({
    trend: getCache(`emp-trend-${selectedDate}-${currentLanguageCode}`) || [],
    recent: getCache(`emp-recent-${selectedDate}-${currentLanguageCode}`)?.results || [],
    recommendation: getCache(`emp-rec-${selectedDate}-${currentLanguageCode}`)?.[0] || null,
  }));
  const [dashboardLoading, setDashboardLoading] = useState(() =>
    !getCache(analyticsCacheKey)
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsSidebarOpen(mql.matches);
    const handler = (e) => setIsSidebarOpen(e.matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
    } else {
      mql.addListener(handler);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler);
      } else {
        mql.removeListener(handler);
      }
    };
  }, []);

  useEffect(() => {
    let midnightTimer;

    const updateToToday = () => {
      if (isFollowingToday.current) {
        setSelectedDate(getTodayInputValue());
      }
    };

    const scheduleMidnightUpdate = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      midnightTimer = window.setTimeout(() => {
        updateToToday();
        scheduleMidnightUpdate();
      }, nextMidnight.getTime() - now.getTime() + 250);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateToToday();
      }
    };

    scheduleMidnightUpdate();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(midnightTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDateChange = (date) => {
    isFollowingToday.current = date === getTodayInputValue();
    setSelectedDate(date);
  };

  useEffect(() => {
    let isMounted = true;

    const trendCacheKey = `emp-trend-${selectedDate}-${currentLanguageCode}`;
    const recentCacheKey = `emp-recent-${selectedDate}-${currentLanguageCode}`;
    const recommendationCacheKey = `emp-rec-${selectedDate}-${currentLanguageCode}`;

    const loadDashboard = async ({ force = false } = {}) => {
      try {
        // Start every independent dashboard request together.  State is
        // committed once the batch settles so sections do not cascade in.
        const [profile, analytics, trend, recent, recommendations] = await Promise.all([
          fetchWithCache(profileCacheKey, getProfile, { force }),
          fetchWithCache(analyticsCacheKey, () => getAnalytics(selectedDate), { force }),
          fetchWithCache(trendCacheKey, () => getDashboardTrend(selectedDate), { force }),
          fetchWithCache(recentCacheKey, () => getActivityHistory(1, selectedDate), { force }),
          fetchWithCache(
            recommendationCacheKey,
            () => getAIRecommendations(selectedDate, currentLanguageCode),
            { force }
          ),
        ]);
        if (isMounted) {
          setDashboardHeader({ profile, analytics });
          setDashboardData({
            trend,
            recent: recent.results || [],
            recommendation: recommendations[0] || null,
          });
        }
      } catch (error) {
        console.error("Dashboard bootstrap error:", error);
      } finally {
        if (isMounted) setDashboardLoading(false);
      }
    };

    loadDashboard();

    const refreshInterval = window.setInterval(() => {
      if (!document.hidden) {
        loadDashboard({ force: true });
      }
    }, 60_000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboard({ force: true });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedDate, currentLanguageCode, profileCacheKey, analyticsCacheKey]);

  useEffect(() => {
    const onRealtime = ({ detail }) => {
      if (detail?.event !== "ACTIVITY_STATUS_CHANGED") return;
      setDashboardData((previous) => {
        if (!detail.activity?.id) return previous;
        const nextActivity = detail.activity;
        const recent = [nextActivity, ...previous.recent.filter((item) => item.id !== nextActivity.id)].slice(0, 20);
        return { ...previous, recent };
      });
    };
    window.addEventListener("focusguard:realtime", onRealtime);
    return () => window.removeEventListener("focusguard:realtime", onRealtime);
  }, []);

  const outletContext = useMemo(
    () => ({
      selectedDate,
      setSelectedDate: handleDateChange,
      dashboardHeader,
      dashboardData,
      dashboardLoading,
      setDashboardHeader,
    }),
    [dashboardData, dashboardHeader, dashboardLoading, selectedDate]
  );

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex min-h-screen bg-[#F3F7FF] dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 md:ml-64">
          <TopNavbar
            profile={dashboardHeader.profile}
            analytics={dashboardHeader.analytics}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="mx-auto w-full max-w-screen-2xl">
              <Outlet context={outletContext} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return <DashboardLayoutContent />;
}
