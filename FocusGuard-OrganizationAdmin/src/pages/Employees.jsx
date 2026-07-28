import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeAnalyticsDialog from "../components/employees/EmployeeAnalyticsDialog";

import { Users } from "lucide-react";

import {
    getEmployees,
} from "../services/employeeService";
import {
    getApiErrorMessage,
    normalizeListResponse,
} from "../utils/responseUtils";

const PAGE_SIZE = 10;

function Employees() {

    const [loading, setLoading] = useState(true);

    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [openDialog, setOpenDialog] =
        useState(false);

    async function fetchEmployees() {

    try {

        const response = await getEmployees();

        setEmployees(
            normalizeListResponse(
                response,
                ["members", "users", "results", "employees", "data"]
            )
        );
        setError("");

    }

    catch (error) {

        console.error(error);

        setEmployees([]);
        setError(
            getApiErrorMessage(
                error,
                "Employees could not be loaded."
            )
        );

    }

    finally {

        setLoading(false);

    }

}

    useEffect(() => {

        const timeout = setTimeout(fetchEmployees, 0);

        return () => clearTimeout(timeout);

    }, []);

    const filteredEmployees =
        employees.filter((employee) =>

            employee.username
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            employee.email
                ?.toLowerCase()
                .includes(search.toLowerCase())

        );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEmployees.length / PAGE_SIZE)
    );

    const visibleEmployees = filteredEmployees.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleView = (employee) => {

        setSelectedEmployee(employee);

        setOpenDialog(true);

    };

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <PageHeader
                    title="Employees"
                    subtitle="Manage all employees in your organization"
                    action={
                        <button
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white shadow hover:bg-indigo-700 transition"
                        >

                            <Users size={18} />

                            Total Employees : {employees.length}

                        </button>
                    }
                />

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                    <SearchBar
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search employee..."
                    />

                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <EmployeeTable
                        employees={visibleEmployees}
                        onView={handleView}
                    />

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
                        <span>
                            Showing {visibleEmployees.length} of{" "}
                            {filteredEmployees.length} employees
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((value) =>
                                        Math.max(1, value - 1)
                                    )
                                }
                                className="rounded-lg border px-3 py-2 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage((value) =>
                                        Math.min(
                                            totalPages,
                                            value + 1
                                        )
                                    )
                                }
                                className="rounded-lg border px-3 py-2 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <EmployeeAnalyticsDialog
                    key={selectedEmployee?.id || "employee-analytics"}
                    open={openDialog}
                    onClose={() =>
                        setOpenDialog(false)
                    }
                    employee={selectedEmployee}
                />

            </div>

        </DashboardLayout>

    );

}

export default Employees;
