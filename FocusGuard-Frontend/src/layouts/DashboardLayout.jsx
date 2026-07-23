import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [selectedDate, setSelectedDate] = useState(
    getTodayInputValue()
  );

  const [dashboardHeader, setDashboardHeader] = useState({
    profile: null,
    analytics: null,
  });

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <TopNavbar
          profile={dashboardHeader.profile}
          analytics={dashboardHeader.analytics}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          <Outlet
            context={{
              selectedDate,
              setSelectedDate,
              setDashboardHeader,
            }}
          />
        </main>
      </div>
    </div>
  );
}