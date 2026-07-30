import { useLanguage } from "../../context/useLanguage";

function EmployeesTable({
    employees = [],
}) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">
                {t(
                    "employees",
                    "Employees"
                )}
            </h2>

            <table className="w-full">
                <thead>
                    <tr className="border-b text-left">
                        <th className="py-4">
                            {t(
                                "employee",
                                "Employee"
                            )}
                        </th>

                        <th>
                            {t(
                                "email",
                                "Email"
                            )}
                        </th>

                        <th>
                            {t(
                                "department",
                                "Department"
                            )}
                        </th>

                        <th>
                            {t(
                                "productive",
                                "Productive"
                            )}
                        </th>

                        <th>
                            {t(
                                "unproductive",
                                "Unproductive"
                            )}
                        </th>

                        <th>
                            {t(
                                "status",
                                "Status"
                            )}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-8 text-center text-gray-500"
                            >
                                {t(
                                    "no_employees_found",
                                    "No employees found."
                                )}
                            </td>
                        </tr>
                    ) : (
                        employees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="py-5 font-semibold">
                                    {employee.name ||
                                        employee.username}
                                </td>

                                <td>
                                    {employee.email}
                                </td>

                                <td>
                                    {employee.department}
                                </td>

                                <td className="text-green-600 font-semibold">
                                    {employee.productive}%
                                </td>

                                <td className="text-red-600 font-semibold">
                                    {employee.unproductive}%
                                </td>

                                <td>
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            employee.status ===
                                            "Active"
                                                ? "bg-green-600"
                                                : "bg-gray-500"
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
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeesTable;