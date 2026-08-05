import { Outlet } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { getProfile } from "../services/profileService";
import { getAnalytics } from "../services/analyticsService";

const getTodayInputValue = () => {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().slice(0, 10);
};

export default function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState(getTodayInputValue());

  const [dashboardHeader, setDashboardHeader] = useState({
    profile: null,
    analytics: null,
  });

  // Sidebar state (closed by default, initialized based on screen size)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    const loadHeader = async () => {
      try {
        const [profile, analytics] = await Promise.all([
          getProfile(),
          getAnalytics(selectedDate),
        ]);

        setDashboardHeader({
          profile,
          analytics,
        });
      } catch (error) {
        console.error("Header Error:", error);
      }
    };

    loadHeader();
  }, [selectedDate]);

  const outletContext = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      dashboardHeader,
      setDashboardHeader,
    }),
    [dashboardHeader, selectedDate]
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 min-w-0 flex-col overflow-hidden transition-all duration-300">
        <TopNavbar
          profile={dashboardHeader.profile}
          analytics={dashboardHeader.analytics}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto w-full max-w-screen-2xl">
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>
    </div>
  );
}  