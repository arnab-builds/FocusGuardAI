import {
  FiHome,
  FiBarChart2,
  FiFileText,
  FiClock,
  FiCpu,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiTarget,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useLanguage } from "../context/useLanguage";

const menuItems = [
  {
    labelKey: "dashboard",
    fallback: "Dashboard",
    icon: <FiHome className="h-6 w-6" />,
    path: "/dashboard",
  },
  {
    labelKey: "analytics",
    fallback: "Analytics",
   icon: <FiHome className="h-6 w-6" />,
    path: "/analytics",
  },
  {
    labelKey: "focus_goals",
    fallback: "Focus Goals",
    icon: <FiTarget className="h-6 w-6" />,
    path: "/focus-goals",
  },
  {
    labelKey: "reports",
    fallback: "Reports",
    icon: <FiFileText className="h-6 w-6" />,
    path: "/reports",
  },
  {
    labelKey: "activity_log",
    fallback: "Activity Log",
    icon: <FiClock className="h-6 w-6" />,
    path: "/activity",
  },
  {
    labelKey: "ai_coach",
    fallback: "AI Coach",
    icon: <FiCpu className="h-6 w-6" />,
    path: "/ai-coach",
  },
  {
    labelKey: "reminders",
    fallback: "Reminders",
    icon: <FiCalendar className="h-6 w-6" />,
    path: "/reminders",
  },
  {
    labelKey: "settings",
    fallback: "Settings",
    icon: <FiSettings className="h-6 w-6" />,
    path: "/settings",
  },
];

export default function Sidebar({ isOpen = true, onClose = () => {} }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    const confirmed = window.confirm(
      t("logout_confirmation", "Are you sure you want to logout?")
    );

    if (!confirmed) return;

    await logoutUser();

    navigate("/", { replace: true });
  };

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
        className={`fixed inset-0 left-0 z-50 flex h-screen w-64 flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out md:relative md:sticky md:top-0 md:inset-auto md:h-auto md:min-h-screen md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Focus</span>
              <span className="text-indigo-500">Guard</span>
            </h1>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {t(
                "employee_productivity_platform",
                "Employee Productivity Platform"
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-5">
          <div className="flex flex-1 flex-col space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.labelKey}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
  `group flex items-center gap-5 rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">
                  {t(item.labelKey, item.fallback)}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold transition-all duration-200 hover:bg-red-600 active:scale-[0.98]"
          >
            <FiLogOut size={18} />
            {t("logout", "Logout")}
          </button>
        </div>
      </aside>
    </>
  );
}