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
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { getStoredOrganizationName } from "../utils/activityUtils";

const menus = [

    {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
},

{
    title: "Employees",
    icon: Users,
    path: "/employees",
},

{
    title: "Invite Employee",
    icon: UserPlus,
    path: "/invite",
},

{
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
},

{
    title: "Notifications",
    icon: Bell,
    path: "/notifications",
},

{
    title: "Requests",
    icon: FileClock,
    path: "/requests",
},

{
    title: "AI Assistant",
    icon: Bot,
    path: "/ai-assistant",
},

{
    title: "Settings",
    icon: Settings,
    path: "/settings",
},
];

function Sidebar() {

    const organizationName =
        getStoredOrganizationName();

    const username =
        localStorage.getItem("username") ||
        "Organization Admin";

    const email =
        localStorage.getItem("email") ||
        "admin@organization.com";

    return (

        <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl">

            {/* Logo */}

            <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-800">

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

            {/* Navigation */}

            <nav className="flex-1 px-4 py-6 space-y-2">

                {

                    menus.map((menu) => {

                        const Icon = menu.icon;

                        return (

                            <NavLink
                                key={menu.title}
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

                    })

                }

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
