import { Outlet } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { getProfile } from "../services/profileService";
import { getAnalytics } from "../services/analyticsService";
import { useTheme } from "../context/ThemeContext";

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

  const [dashboardHeader, setDashboardHeader] = useState({
    profile: null,
    analytics: null,
  });

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
    const loadHeader = async () => {
      try {
        const [profile, analytics] = await Promise.all([
          getProfile(),
          getAnalytics(selectedDate),
        ]);
        setDashboardHeader({ profile, analytics });
      } catch (error) {
        console.error("Header Error:", error);
      }
    };
    loadHeader();

    const refreshInterval = window.setInterval(() => {
      if (!document.hidden) {
        loadHeader();
      }
    }, 30_000);

    return () => window.clearInterval(refreshInterval);
  }, [selectedDate]);

  const outletContext = useMemo(
    () => ({
      selectedDate,
      setSelectedDate: handleDateChange,
      dashboardHeader,
      setDashboardHeader,
    }),
    [dashboardHeader, selectedDate]
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
