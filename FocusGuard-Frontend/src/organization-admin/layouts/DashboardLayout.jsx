import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { OrgThemeProvider, useOrgTheme } from "../context/OrgThemeContext";

function DashboardLayoutContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );
  const { theme } = useOrgTheme();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");

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

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex min-h-screen bg-[#F3F7FF] dark:bg-[#0B1120] text-slate-900 dark:text-slate-50">
        <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden md:ml-72">
        <Navbar
          onToggleSidebar={() =>
            setIsSidebarOpen((prev) => !prev)
          }
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto w-full max-w-[1700px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <OrgThemeProvider>
      <DashboardLayoutContent />
    </OrgThemeProvider>
  );
}
