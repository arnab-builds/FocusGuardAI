import {
    LayoutDashboard,
    Building2,
    Mail,
    FileClock,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useLanguage } from "../../context/useLanguage";

function Sidebar({ isOpen = true, onClose = () => {} }) {
    const { t } = useLanguage();

    const menus = [
        {
            title: t("dashboard", "Dashboard"),
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            title: t("organizations", "Organizations"),
            icon: Building2,
            path: "/organizations",
        },
        {
            title: t("invitations", "Invitations"),
            icon: Mail,
            path: "/invitations",
        },
        {
            title: t("requests", "Requests"),
            icon: FileClock,
            path: "/requests",
        },
        {
            title: t("normal_users", "Normal Users"),
            icon: Users,
            path: "/normal-users",
        },
        {
            title: t("analytics", "Analytics"),
            icon: BarChart3,
            path: "/analytics",
        },
        {
            title: t("settings", "Settings"),
            icon: Settings,
            path: "/settings",
        },
    ];

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />
            <aside className={`fixed left-0 top-0 z-50 h-screen w-72 max-w-full transform flex flex-col bg-slate-900 text-white shadow-xl transition-transform md:relative md:translate-x-0 md:flex md:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-800">
                <div className="bg-blue-600 rounded-xl p-3">
                    <ShieldCheck size={26} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">
                        FocusGuardAI
                    </h1>

                    <p className="text-sm text-slate-400">
                        {t(
                            "super_admin",
                            "Super Admin"
                        )}
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menus.map((menu) => {
                    const Icon = menu.icon;

                    return (
                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600 shadow-lg"
                                        : "hover:bg-slate-800"
                                }`
                            }
                        >
                            <Icon size={20} />

                            <span className="font-medium">
                                {menu.title}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-800 p-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="font-semibold">
                            {t(
                                "super_admin",
                                "Super Admin"
                            )}
                        </p>

                        <p className="text-sm text-slate-400">
                            admin@focusguard.ai
                        </p>
                    </div>
                </div>

                <button
                    className="flex items-center gap-3 w-full bg-red-500 hover:bg-red-600 transition rounded-xl px-5 py-3"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                >
                    <LogOut size={20} />
                    {t(
                        "logout",
                        "Logout"
                    )}
                </button>
            </div>
        </aside>
        </>
    );
}

export default Sidebar;
