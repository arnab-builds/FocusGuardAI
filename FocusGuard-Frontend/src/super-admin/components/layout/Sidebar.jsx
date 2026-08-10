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
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";

function Sidebar({ isOpen = true, onClose = () => {} }) {
    const { t } = useLanguage();

    const menus = [
        {
            title: t("dashboard", "Dashboard"),
            icon: LayoutDashboard,
            path: "/super-admin/dashboard",
        },
        {
            title: t("organizations", "Organizations"),
            icon: Building2,
            path: "/super-admin/organizations",
        },
        {
            title: t("invitations", "Invitations"),
            icon: Mail,
            path: "/super-admin/invitations",
        },
        {
            title: t("requests", "Requests"),
            icon: FileClock,
            path: "/super-admin/requests",
        },
        {
            title: t("normal_users", "Normal Users"),
            icon: Users,
            path: "/super-admin/normal-users",
        },
        {
            title: t("analytics", "Analytics"),
            icon: BarChart3,
            path: "/super-admin/analytics",
        },
        {
            title: t("settings", "Settings"),
            icon: Settings,
            path: "/super-admin/settings",
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}

            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 md:hidden ${
                    isOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-6">

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">

                            <ShieldCheck size={28} />

                        </div>

                        <div>

                            <h1 className="text-2xl font-bold tracking-tight">

                                <span className="text-white">
                                    Focus
                                </span>

                                <span className="text-blue-500">
                                    Guard
                                </span>

                            </h1>

                            <p className="mt-1 text-xs text-slate-300">

                                {t(
                                    "super_admin",
                                    "Super Admin"
                                )}

                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Navigation */}

                <nav className="flex-1 overflow-y-auto px-3 py-5">

                    <div className="space-y-2">

                        {menus.map((menu) => {
                            const Icon = menu.icon;

                            return (
                                <NavLink
                                    key={menu.path}
                                    to={menu.path}
                                    onClick={() => {
                                        if (
                                            window.innerWidth <
                                            768
                                        ) {
                                            onClose();
                                        }
                                    }}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                        }`
                                    }
                                >
                                    <Icon
                                        size={22}
                                        className="shrink-0"
                                    />

                                    <span className="truncate">
                                        {menu.title}
                                    </span>
                                </NavLink>
                            );
                        })}

                    </div>

                </nav>

                {/* Footer */}

                <div className="border-t border-slate-800 p-5">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white">

                                S

                            </div>

                            <div className="min-w-0 flex-1">

                                <h3 className="truncate font-semibold text-white">

                                    {t(
                                        "super_admin",
                                        "Super Admin"
                                    )}

                                </h3>

                                <p className="truncate text-xs text-slate-300">

                                    admin@focusguard.ai

                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href =
                                "/login";
                        }}
                        className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-600 active:scale-[0.98]"
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
