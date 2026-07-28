import { Eye } from "lucide-react";
import { getRoundedProductivity } from "../../utils/responseUtils";

function EmployeeTable({
    employees = [],
    onView,
}) {

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                Employee
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                Email
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                Role
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                Status
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                Productivity
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            employees.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-slate-500"
                                    >

                                        No Employees Found

                                    </td>

                                </tr>

                            ) : (

                                employees.map((employee) => {

                                    const name =
                                        employee.full_name ||
                                        employee.username;

                                    const productivity =
                                        getRoundedProductivity(employee);

                                    return (

                                        <tr
                                            key={employee.id}
                                            className="border-t hover:bg-slate-50 transition"
                                        >

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-4">

                                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">

                                                        {name?.charAt(0)?.toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <p className="font-semibold text-slate-800">

                                                            {name}

                                                        </p>

                                                        <p className="text-sm text-slate-500">

                                                            ID #{employee.id}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-6 py-4 text-slate-600">

                                                {employee.email}

                                            </td>

                                            <td className="px-6 py-4">

                                                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm">

                                                    {employee.role}

                                                </span>

                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        employee.is_active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >

                                                    {
                                                        employee.is_active
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-28 h-2 rounded-full bg-slate-200">

                                                        <div
                                                            className="h-2 rounded-full bg-indigo-600"
                                                            style={{
                                                                width: `${productivity}%`,
                                                            }}
                                                        />

                                                    </div>

                                                    <span className="font-semibold text-slate-700">

                                                        {productivity}%

                                                    </span>

                                                </div>

                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex justify-center">

                                                    <button
                                                        onClick={() => onView(employee)}
                                                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
                                                    >

                                                        <Eye size={16} />

                                                        View

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })

                            )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default EmployeeTable;
