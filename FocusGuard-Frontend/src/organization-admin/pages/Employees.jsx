import { useEffect, useState } from "react";


import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeAnalyticsDialog from "../components/employees/EmployeeAnalyticsDialog";

import { Users } from "lucide-react";

import { useLanguage } from "../context/useLanguage";

import {
    getEmployees,
} from "../services/employeeService";
import {
    getApiErrorMessage,
    normalizeListResponse,
} from "../utils/responseUtils";

import { fetchWithCache, getCache } from "../../utils/apiCache";

const PAGE_SIZE = 10;

function Employees() {
    const { t } = useLanguage();

    const cacheKey = "org-employees";

    const [employees, setEmployees] = useState(() => {
        const cached = getCache(cacheKey);
        return cached ? normalizeListResponse(cached, ["members", "users", "results", "employees", "data"]) : [];
    });
    const [loading, setLoading] = useState(() => !getCache(cacheKey));

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [openDialog, setOpenDialog] =
        useState(false);

    async function fetchEmployees() {
        try {
            if (!getCache(cacheKey)) setLoading(true);
            const response = await fetchWithCache(cacheKey, getEmployees);

            setEmployees(
                normalizeListResponse(
                    response,
                    ["members", "users", "results", "employees", "data"]
                )
            );

            setError("");
        } catch (error) {
            console.error(error);

            setEmployees([]);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "employees_load_failed",
                        "Employees could not be loaded."
                    )
                )
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(fetchEmployees, 0);

        return () => clearTimeout(timeout);
    }, []);

    const filteredEmployees =
        employees.filter(
            (employee) =>
                employee.username
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
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

    return (
        <>
            {loading ? (
                <LoadingSpinner />
            ) : (
            <div className="space-y-8">
                <PageHeader
    title={t(
        "employee_management",
        "Employee Management"
    )}
    subtitle={t(
        "manage_track_employees",
        "Manage employees, monitor activity, and view productivity insights."
    )}
                    action={
                        <div className="flex items-center gap-3 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-800 px-5 py-3 shadow-sm">
                      <div className="rounded-xl bg-indigo-100 dark:bg-indigo-900/40 p-3">
                      <Users
                     size={20}
                  className="text-indigo-600 dark:text-indigo-400"
                />
    </div>

    <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("employees", "Employees")}
        </p>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {employees.length}
        </h3>
    </div>
</div>
                    
                    }
                />

                <div className="rounded-2xl border border-blue-100/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/20 dark:to-slate-800 shadow-sm p-5">
                    <SearchBar
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder={t(
                            "search_employee",
                            "Search employee..."
                        )}
                    />
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 dark:border-rose-900/50 bg-red-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-red-700 dark:text-rose-400">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <EmployeeTable
                        employees={visibleEmployees}
                        onView={handleView}
                    />

                    <div className="w-full flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 md:p-5 md:flex-row md:items-center md:justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-600 dark:text-slate-400 text-center md:text-left whitespace-nowrap">
    {t("showing", "Showing")}{" "}
    <span className="font-semibold text-slate-900 dark:text-slate-200">
        {visibleEmployees.length}
    </span>{" "}
    {t("of", "of")}{" "}
    <span className="font-semibold text-slate-900 dark:text-slate-200">
        {filteredEmployees.length}
    </span>{" "}
    {t("employees", "employees")}
</span>

                        <div className="flex justify-center items-center gap-3 flex-wrap">
    <button
        type="button"
        disabled={page === 1}
        onClick={() =>
            setPage((value) =>
                Math.max(1, value - 1)
            )
        }
        className={`shrink-0 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
            page === 1
                ? "cursor-not-allowed border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 shadow-none"
                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
    >
        ← {t("previous", "Previous")}
    </button>

    <div className="shrink-0 min-w-[90px] whitespace-nowrap rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
        {t("page", "Page")}{" "}
        <span className="text-indigo-600 dark:text-indigo-400">
            {page}
        </span>{" "}
        / {totalPages}
    </div>

    <button
        type="button"
        disabled={page === totalPages}
        onClick={() =>
            setPage((value) =>
                Math.min(totalPages, value + 1)
            )
        }
        className={`shrink-0 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
            page === totalPages
                ? "cursor-not-allowed border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 shadow-none"
                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
    >
        {t("next", "Next")} →
    </button>
</div>
                    </div>
                </div>

                <EmployeeAnalyticsDialog
                    key={
                        selectedEmployee?.id ||
                        "employee-analytics"
                    }
                    open={openDialog}
                    onClose={() =>
                        setOpenDialog(false)
                    }
                    employee={selectedEmployee}
                />
            </div>
            )}
        </>
    );
}

export default Employees;