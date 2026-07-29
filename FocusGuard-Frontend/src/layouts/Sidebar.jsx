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
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useLanguage } from "../context/useLanguage";

const menuItems = [
  {
    labelKey: "dashboard",
    fallback: "Dashboard",
    icon: <FiHome size={20} />,
    path: "/dashboard",
  },
  {
    labelKey: "analytics",
    fallback: "Analytics",
    icon: <FiBarChart2 size={20} />,
    path: "/analytics",
  },
  {
    labelKey: "focus_goals",
    fallback: "Focus Goals",
    icon: <FiTarget size={20} />,
    path: "/focus-goals",
  },
  {
    labelKey: "reports",
    fallback: "Reports",
    icon: <FiFileText size={20} />,
    path: "/reports",
  },
  {
    labelKey: "activity_log",
    fallback: "Activity Log",
    icon: <FiClock size={20} />,
    path: "/activity",
  },
  {
    labelKey: "ai_coach",
    fallback: "AI Coach",
    icon: <FiCpu size={20} />,
    path: "/ai-coach",
  },
  {
    labelKey: "reminders",
    fallback: "Reminders",
    icon: <FiCalendar size={20} />,
    path: "/reminders",
  },
  {
    labelKey: "settings",
    fallback: "Settings",
    icon: <FiSettings size={20} />,
    path: "/settings",
  },
];

export default function Sidebar() {
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
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-slate-950 text-white shadow-xl">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Focus</span>
          <span className="text-indigo-500">Guard</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {t(
            "employee_productivity_platform",
            "Employee Productivity Platform"
          )}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.labelKey}
            to={item.path}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-4 rounded-xl px-5 py-3 font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{t(item.labelKey, item.fallback)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 font-medium transition-all duration-200 hover:bg-red-600"
        >
          <FiLogOut size={18} />
          {t("logout", "Logout")}
        </button>
      </div>
    </aside>
  );
}