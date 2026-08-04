import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
    // Sidebar responsive state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 768px)');
        setIsSidebarOpen(mql.matches);
        const handler = (e) => setIsSidebarOpen(e.matches);
        mql.addEventListener?.('change', handler);
        return () => mql.removeEventListener?.('change', handler);
    }, []);

    return (
        <div className="flex min-h-screen h-screen overflow-hidden bg-slate-100">

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">

                <Navbar onToggleSidebar={() => setIsSidebarOpen((s) => !s)} />

                <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-5">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;