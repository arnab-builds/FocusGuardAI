import {
  LayoutDashboard,
  Building2,
  Mail,
  FileClock,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard", // ✅ Fixed
  },
  {
    title: "Organizations",
    icon: Building2,
    path: "/organizations",
  },
  {
    title: "Invitations",
    icon: Mail,
    path: "/invitations",
  },
  {
    title: "Requests",
    icon: FileClock,
    path: "/requests",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-800">

        <div className="bg-blue-600 rounded-xl p-3">
          <ShieldCheck size={26} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">FocusGuardAI</h1>
          <p className="text-sm text-slate-400">
            Super Admin
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.title}
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

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">

        <div className="flex items-center justify-between mb-5">

          <div>
            <p className="font-semibold">
              Super Admin
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
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;