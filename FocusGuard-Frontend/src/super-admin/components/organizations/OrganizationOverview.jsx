import {
    Building2,
    Users,
    UserCheck,
    UserX,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

function ProgressBar({ value, color }) {
    return (
        <div className="mt-4">
            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className={`${color} h-4 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${value}%` }}
                />
            </div>

            <div className="mt-3 flex justify-end">
                <span
                    className={`${color} inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm`}
                >
                    {value}%
                </span>
            </div>
        </div>
    );
}

const cardThemes = {
    blue: {
        iconWrap:
            "bg-gradient-to-br from-blue-50 to-blue-100/70 text-blue-600 ring-1 ring-blue-100",
        cardBg:
            "bg-gradient-to-br from-blue-50/70 to-white border-t-[3px] border-t-blue-500 border-blue-100/50",
    },
    emerald: {
        iconWrap:
            "bg-gradient-to-br from-emerald-50 to-emerald-100/70 text-emerald-600 ring-1 ring-emerald-100",
        cardBg:
            "bg-gradient-to-br from-emerald-50/70 to-white border-t-[3px] border-t-emerald-500 border-emerald-100/50",
    },
    red: {
        iconWrap:
            "bg-gradient-to-br from-red-50 to-red-100/70 text-red-600 ring-1 ring-red-100",
        cardBg:
            "bg-gradient-to-br from-red-50/70 to-white border-t-[3px] border-t-red-500 border-red-100/50",
    },
    indigo: {
        iconWrap:
            "bg-gradient-to-br from-indigo-50 to-indigo-100/70 text-indigo-600 ring-1 ring-indigo-100",
        cardBg:
            "bg-gradient-to-br from-indigo-50/70 to-white border-t-[3px] border-t-indigo-500 border-indigo-100/50",
    },
};

function Card({ icon, title, value, theme = "blue" }) {
    const { iconWrap, cardBg } =
        cardThemes[theme] || cardThemes.blue;

    return (
        <div
            className={`${cardBg} rounded-3xl shadow-sm border p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        >
            <div
                className={`${iconWrap} p-4 rounded-2xl [&>svg]:h-7 [&>svg]:w-7`}
            >
                {icon}
            </div>

            <div>
                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-1">
                    {value}
                </h2>
            </div>
        </div>
    );
}

function OrganizationOverview({
    organization,
    summary,
}) {
    const { t } = useLanguage();

    return (
        <>
            <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100/60 text-indigo-600 ring-1 ring-indigo-100">
                    <Building2 size={26} />
                </span>

                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {organization.name}
                    </h1>

                    <p className="text-slate-500 mt-1">
                        {organization.address ||
                            t(
                                "organization_performance_overview",
                                "Organization Performance Overview"
                            )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <Card
                    title={t(
                        "employees",
                        "Employees"
                    )}
                    value={summary.employees}
                    icon={<Users />}
                    theme="blue"
                />

                <Card
                    title={t(
                        "active",
                        "Active"
                    )}
                    value={summary.active}
                    icon={<UserCheck />}
                    theme="emerald"
                />

                <Card
                    title={t(
                        "inactive",
                        "Inactive"
                    )}
                    value={summary.inactive}
                    icon={<UserX />}
                    theme="red"
                />

                <Card
                    title={t(
                        "organization",
                        "Organization"
                    )}
                    value={organization.id}
                    icon={<Building2 />}
                    theme="indigo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="rounded-3xl border border-emerald-100/50 bg-gradient-to-br from-emerald-50/70 to-white shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 text-emerald-600 ring-1 ring-emerald-100">
                            <UserCheck size={18} />
                        </span>

                        <h2 className="text-xl font-semibold text-slate-900">
                            {t(
                                "overall_productivity",
                                "Overall Productivity"
                            )}
                        </h2>
                    </div>

                    <ProgressBar
                        value={summary.productive}
                        color="bg-gradient-to-r from-emerald-500 to-green-400"
                    />
                </div>

                <div className="rounded-3xl border border-red-100/50 bg-gradient-to-br from-red-50/70 to-white shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-red-100/70 text-red-600 ring-1 ring-red-100">
                            <UserX size={18} />
                        </span>

                        <h2 className="text-xl font-semibold text-slate-900">
                            {t(
                                "overall_unproductive",
                                "Overall Unproductive"
                            )}
                        </h2>
                    </div>

                    <ProgressBar
                        value={summary.unproductive}
                        color="bg-gradient-to-r from-red-500 to-rose-400"
                    />
                </div>
            </div>
        </>
    );
}

export default OrganizationOverview;