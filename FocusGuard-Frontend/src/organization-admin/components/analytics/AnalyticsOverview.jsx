import {
    Users,
    TrendingUp,
    Clock3,
    Globe,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

function AnalyticsOverview({ analytics }) {
    const { t } = useLanguage();

    const cards = [
        {
            title: t(
                "employees",
                "Employees"
            ),
            value:
                analytics.total_employees ??
                0,
            description: t(
                "total_registered_employees",
                "Total registered employees"
            ),
            icon: Users,
            color: "text-indigo-600 bg-indigo-50",
        },
        {
            title: t(
                "productivity",
                "Productivity"
            ),
            value: `${
                analytics.productive_percentage ??
                0
            }%`,
            description: t(
                "average_organization_productivity",
                "Average organization productivity"
            ),
            icon: TrendingUp,
            color: "text-green-600 bg-green-50",
        },
        {
            title: t(
                "active_employees",
                "Active Employees"
            ),
            value:
                analytics.active_employees ??
                0,
            description: t(
                "currently_active_today",
                "Currently active today"
            ),
            icon: Clock3,
            color: "text-amber-600 bg-amber-50",
        },
        {
            title: t(
                "inactive_employees",
                "Inactive Employees"
            ),
            value:
                analytics.inactive_employees ??
                0,
            description: t(
                "currently_inactive",
                "Currently inactive"
            ),
            icon: Globe,
            color: "text-sky-600 bg-sky-50",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="group relative min-h-[170px] bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 overflow-hidden"
                    >
                        <span className="absolute top-5 right-7 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {t("live", "Live")}
                        </span>

                        <div className="flex items-start justify-between gap-4">
                            <p className="text-base font-semibold text-slate-600">
                                {card.title}
                            </p>

                            <div
                                className={`h-16 w-16 shrink-0 rounded-2xl shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${card.color}`}
                            >
                                <Icon size={28} />
                            </div>
                        </div>

                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-4">
                            {card.value}
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                            {card.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default AnalyticsOverview;