import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
        typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
    );
    const [theme, setTheme] = useState(() =>
        localStorage.getItem("focusguard_superadmin_theme") === "dark"
            ? "dark"
            : "light"
    );

    useEffect(() => {
        const handleThemeChange = (event) => {
            setTheme(event.detail === "dark" ? "dark" : "light");
        };

        window.addEventListener("superadmin-theme-change", handleThemeChange);

        return () => {
            window.removeEventListener("superadmin-theme-change", handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");

        const handler = (event) =>
            setIsSidebarOpen(event.matches);

        if (mql.addEventListener) {
            mql.addEventListener(
                "change",
                handler
            );
        } else {
            mql.addListener(handler);
        }

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener(
                    "change",
                    handler
                );
            } else {
                mql.removeListener(handler);
            }
        };
    }, []);

    return (
        <div
            className="superadmin-shell flex min-h-screen bg-[#F3F7FF]"
            data-superadmin-theme={theme}
        >
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() =>
                    setIsSidebarOpen(false)
                }
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300">

                <Navbar
                    onToggleSidebar={() =>
                        setIsSidebarOpen(
                            (prev) => !prev
                        )
                    }
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">

                    <div className="mx-auto w-full max-w-screen-2xl">

                        <Outlet />

                    </div>

                </main>

            </div>
        </div>
    );
}

export default AdminLayout;
