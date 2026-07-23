import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

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