import {
    LayoutDashboard,
    Users,
    UserPlus,
    BarChart3,
    Bell,
    FileClock,
    Bot,
    Settings,
    LogOut,
    Building2,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { getStoredOrganizationName } from "../utils/activityUtils";
import { useLanguage } from "../context/useLanguage";

function Sidebar({ isOpen = true, onClose = () => {} }) {
    const { t } = useLanguage();

    const menus = [
        {
            title: t("dashboard", "Dashboard"),
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            title: t("employees", "Employees"),
            icon: Users,
            path: "/employees",
        },
        {
            title: t("invite_employee", "Invite Employee"),
            icon: UserPlus,
            path: "/invite",
        },
        {
            title: t("analytics", "Analytics"),
            icon: BarChart3,
            path: "/analytics",
        },
        {
            title: t("notifications", "Notifications"),
            icon: Bell,
            path: "/notifications",
        },
        {
            title: t("requests", "Requests"),
            icon: FileClock,
            path: "/requests",
        },
        {
            title: t("ai_assistant", "AI Assistant"),
            icon: Bot,
            path: "/ai-assistant",
        },
        {
            title: t("settings", "Settings"),
            icon: Settings,
            path: "/settings",
        },
    ];

    const organizationName =
        getStoredOrganizationName();

    const username =
        localStorage.getItem("username") ||
        t("organization_admin", "Organization Admin");

    const email =
        localStorage.getItem("email") ||
        "admin@organization.com";

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <aside className={`fixed left-0 top-0 z-50 h-screen w-72 max-w-full transform flex-col bg-slate-900 text-white shadow-xl transition-transform md:relative md:translate-x-0 md:flex md:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo */}

            <div className="flex items-center justify-between gap-3 px-6 py-7 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 rounded-xl p-3">
                        <Building2 size={26} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">
                            FocusGuardAI
                        </h1>

                        <p className="text-sm text-slate-400">
                            {organizationName}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="rounded-md bg-slate-800 p-2 text-white hover:bg-slate-700 md:hidden"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}

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
                                        ? "bg-indigo-600 shadow-lg"
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

            {/* Footer */}

            <div className="border-t border-slate-800 p-5">
                <div className="mb-5">
                    <p className="font-semibold">
                        {username}
                    </p>

                    <p className="text-sm text-slate-400">
                        {email}
                    </p>
                </div>

                <button
                    className="flex w-full items-center gap-3 rounded-xl bg-red-500 px-5 py-3 transition hover:bg-red-600"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                >
                    <LogOut size={20} />

                    {t("logout", "Logout")}
                </button>
            </div>
        </aside>
        </>
    );
}

export default Sidebar;
