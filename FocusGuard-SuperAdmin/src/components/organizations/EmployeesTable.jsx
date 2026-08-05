import { Users } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

function EmployeesTable({
    employees = [],
}) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md ring-1 ring-slate-50 overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-3 p-6 sm:p-8 pb-4 sm:pb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 ring-1 ring-blue-100">
                    <Users size={20} strokeWidth={2} />
                </span>

                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {t(
                        "employees",
                        "Employees"
                    )}
                </h2>
            </div>

            {employees.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 ring-1 ring-slate-100 mb-4">
                        <Users size={30} strokeWidth={1.5} />
                    </div>

                    <p className="text-base font-semibold text-slate-600">
                        {t(
                            "no_employees_found",
                            "No employees found."
                        )}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop / tablet table */}
                    <div className="hidden md:block overflow-x-auto px-2 sm:px-4 pb-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 rounded-xl">
                                    <th className="py-4 px-4 rounded-l-xl">
                                        {t(
                                            "employee",
                                            "Employee"
                                        )}
                                    </th>

                                    <th className="py-4 px-4">
                                        {t(
                                            "email",
                                            "Email"
                                        )}
                                    </th>

                                    <th className="py-4 px-4">
                                        {t(
                                            "department",
                                            "Department"
                                        )}
                                    </th>

                                    <th className="py-4 px-4">
                                        {t(
                                            "productive",
                                            "Productive"
                                        )}
                                    </th>

                                    <th className="py-4 px-4">
                                        {t(
                                            "unproductive",
                                            "Unproductive"
                                        )}
                                    </th>

                                    <th className="py-4 px-4 rounded-r-xl">
                                        {t(
                                            "status",
                                            "Status"
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map((employee, index) => (
                                    <tr
                                        key={employee.id}
                                        className={`border-b border-slate-100 last:border-none transition-all duration-300 hover:bg-blue-50/40 hover:shadow-sm ${
                                            index % 2 === 1
                                                ? "bg-slate-50/40"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-5 px-4 font-semibold text-slate-900">
                                            {employee.name ||
                                                employee.username}
                                        </td>

                                        <td className="py-5 px-4 text-sm text-slate-500">
                                            {employee.email}
                                        </td>

                                        <td className="py-5 px-4">
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                                {employee.department}
                                            </span>
                                        </td>

                                        <td className="py-5 px-4">
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm">
                                                {employee.productive}%
                                            </span>
                                        </td>

                                        <td className="py-5 px-4">
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-200/70 shadow-sm">
                                                {employee.unproductive}%
                                            </span>
                                        </td>

                                        <td className="py-5 px-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${
                                                    employee.status ===
                                                    "Active"
                                                        ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                                        : "bg-gradient-to-r from-slate-400 to-slate-500"
                                                }`}
                                            >
                                                {employee.status ===
                                                "Active"
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="md:hidden px-4 sm:px-6 pb-6 space-y-3">
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {employee.name ||
                                                employee.username}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-0.5 truncate">
                                            {employee.email}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${
                                            employee.status ===
                                            "Active"
                                                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                                : "bg-gradient-to-r from-slate-400 to-slate-500"
                                        }`}
                                    >
                                        {employee.status ===
                                        "Active"
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

                                <div className="mt-3">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                        {employee.department}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                    <span className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70 shadow-sm">
                                        {t(
                                            "productive",
                                            "Productive"
                                        )}
                                        : {employee.productive}%
                                    </span>

                                    <span className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200/70 shadow-sm">
                                        {t(
                                            "unproductive",
                                            "Unproductive"
                                        )}
                                        : {employee.unproductive}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default EmployeesTable;