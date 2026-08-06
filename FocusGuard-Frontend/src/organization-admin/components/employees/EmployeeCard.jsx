import {
    Mail,
    Activity,
    Clock3,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { getRoundedProductivity } from "../../utils/responseUtils";

function EmployeeCard({
    employee,
    onView,
}) {
    const { t } = useLanguage();

    const productivity =
        getRoundedProductivity(employee);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                    {employee.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                </div>

                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {employee.username}
                    </h2>

                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                        <Mail size={15} />
                        {employee.email}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Activity size={18} />

                        {t(
                            "productivity",
                            "Productivity"
                        )}
                    </div>

                    <p className="mt-2 text-xl font-bold text-indigo-600">
                        {productivity}%
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock3 size={18} />

                        {t(
                            "status",
                            "Status"
                        )}
                    </div>

                    <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            employee.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {employee.is_active
                            ? t(
                                  "active",
                                  "Active"
                              )
                            : t(
                                  "inactive",
                                  "Inactive"
                              )}
                    </span>
                </div>
            </div>

            <button
                onClick={() =>
                    onView(employee)
                }
                className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 font-semibold"
            >
                {t(
                    "view_analytics",
                    "View Analytics"
                )}
            </button>
        </div>
    );
}

export default EmployeeCard;