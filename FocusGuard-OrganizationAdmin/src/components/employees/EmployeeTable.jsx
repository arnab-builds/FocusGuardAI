import { Eye, Users } from "lucide-react";
import { useLanguage } from "../../context/useLanguage";
import { getRoundedProductivity } from "../../utils/responseUtils";

function EmployeeTable({
    employees = [],
    onView,
}) {
    const { t } = useLanguage();

    if (employees.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
                    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={26} className="text-slate-400" />
                    </div>

                    <p className="text-base font-semibold text-slate-600">
                        {t(
                            "no_employees_found",
                            "No Employees Found"
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Desktop / tablet: table layout */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-5 text-left text-base font-bold text-slate-700">
                                    {t(
                                        "employee",
                                        "Employee"
                                    )}
                                </th>

                                <th className="px-6 py-5 text-left text-base font-bold text-slate-700">
                                    {t(
                                        "email",
                                        "Email"
                                    )}
                                </th>

                                <th className="px-6 py-5 text-left text-base font-bold text-slate-700">
                                    {t(
                                        "role",
                                        "Role"
                                    )}
                                </th>

                                <th className="px-6 py-5 text-left text-base font-bold text-slate-700">
                                    {t(
                                        "status",
                                        "Status"
                                    )}
                                </th>

                                <th className="px-6 py-5 text-left text-base font-bold text-slate-700">
                                    {t(
                                        "productivity",
                                        "Productivity"
                                    )}
                                </th>

                                <th className="px-6 py-5 text-center text-base font-bold text-slate-700">
                                    {t(
                                        "action",
                                        "Action"
                                    )}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((employee) => {
                                const name =
                                    employee.full_name ||
                                    employee.username;

                                const productivity =
                                    getRoundedProductivity(
                                        employee
                                    );

                                return (
                                    <tr
                                        key={employee.id}
                                        className="border-t border-slate-100 hover:bg-indigo-50/40 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-bold text-lg text-indigo-700 ring-1 ring-indigo-200">
                                                    {name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-900 text-base">
                                                        {name}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        ID #
                                                        {
                                                            employee.id
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-slate-600 text-[15px] break-all">
                                            {
                                                employee.email
                                            }
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-700">
                                                {
                                                    employee.role
                                                }
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 ${
                                                    employee.is_active
                                                        ? "bg-green-50 text-green-700 ring-green-200"
                                                        : "bg-red-50 text-red-700 ring-red-200"
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
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                                        style={{
                                                            width: `${productivity}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="font-bold text-slate-800 text-base">
                                                    {
                                                        productivity
                                                    }
                                                    %
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        onView(
                                                            employee
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                                                >
                                                    <Eye
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    {t(
                                                        "view",
                                                        "View"
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile: card layout */}
            <div className="md:hidden flex flex-col gap-4">
                {employees.map((employee) => {
                    const name =
                        employee.full_name ||
                        employee.username;

                    const productivity =
                        getRoundedProductivity(employee);

                    return (
                        <div
                            key={employee.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-bold text-lg text-indigo-700 ring-1 ring-indigo-200">
                                    {name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 text-base truncate">
                                        {name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        ID #{employee.id}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 break-all">
                                {employee.email}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-700">
                                    {employee.role}
                                </span>

                                <span
                                    className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 ${
                                        employee.is_active
                                            ? "bg-green-50 text-green-700 ring-green-200"
                                            : "bg-red-50 text-red-700 ring-red-200"
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

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">
                                        {t(
                                            "productivity",
                                            "Productivity"
                                        )}
                                    </span>

                                    <span className="font-bold text-slate-800 text-base">
                                        {productivity}%
                                    </span>
                                </div>

                                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                        style={{
                                            width: `${productivity}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    onView(employee)
                                }
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-medium shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
                            >
                                <Eye size={16} />

                                {t(
                                    "view_details",
                                    "View Details"
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EmployeeTable;