import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");

        setIsSidebarOpen(mql.matches);

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
        <div className="flex min-h-screen bg-[#F3F7FF]">
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

                        {children}

                    </div>

                </main>

            </div>
        </div>
    );
}

export default AdminLayout;