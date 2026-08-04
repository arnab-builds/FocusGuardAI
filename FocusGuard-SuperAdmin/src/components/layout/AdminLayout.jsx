import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsSidebarOpen(mql.matches);

    const handler = (event) => setIsSidebarOpen(event.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  return (
    <div className="flex min-h-screen h-screen bg-slate-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">

        <Navbar onToggleSidebar={() => setIsSidebarOpen((s) => !s)} />

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-5">

          {children}

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;