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
      path: "/organization-admin/dashboard",
    },
    {
      title: t("employees", "Employees"),
      icon: Users,
      path: "/organization-admin/employees",
    },
    {
      title: t("invite_employee", "Invite Employee"),
      icon: UserPlus,
      path: "/organization-admin/invite",
    },
    {
      title: t("analytics", "Analytics"),
      icon: BarChart3,
      path: "/organization-admin/analytics",
    },
    {
      title: t("notifications", "Notifications"),
      icon: Bell,
      path: "/organization-admin/notifications",
    },
    {
      title: t("requests", "Requests"),
      icon: FileClock,
      path: "/organization-admin/requests",
    },
    {
      title: t("ai_assistant", "AI Assistant"),
      icon: Bot,
      path: "/organization-admin/ai-assistant",
    },
    {
      title: t("settings", "Settings"),
      icon: Settings,
      path: "/organization-admin/settings",
    },
  ];

  const organizationName = getStoredOrganizationName();

  const username =
    localStorage.getItem("username") ||
    t("organization_admin", "Organization Admin");

  const email =
    localStorage.getItem("email") ||
    "admin@organization.com";

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
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}

      <aside
  className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
              <Building2 size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-white">
                  Focus
                </span>

                <span className="text-indigo-500">
                  Guard
                </span>
              </h1>

              <p className="mt-1 text-xs text-slate-300">
                {organizationName}
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

        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-5">
          <div className="flex flex-1 flex-col space-y-2">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  onClick={() => {
                    if (
                      window.innerWidth < 768
                    )
                      onClose();
                  }}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`
                  }
                >
                  <span className="shrink-0">
                    <Icon size={22} />
                  </span>

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

          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white">

              {username.charAt(0).toUpperCase()}

            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate font-semibold text-white">

                {username}

              </p>

              <p className="truncate text-xs text-slate-300">

                {email}

              </p>

            </div>

          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 active:scale-[0.98]"
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
