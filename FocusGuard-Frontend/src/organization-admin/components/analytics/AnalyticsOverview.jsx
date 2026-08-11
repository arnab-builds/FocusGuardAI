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
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400",
            cardClasses: "border-indigo-100/50 border-t-indigo-500 from-indigo-50/70 to-white dark:border-indigo-900/50 dark:border-t-indigo-500 dark:from-indigo-950/20 dark:to-slate-800",
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
            color: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400",
            cardClasses: "border-green-100/50 border-t-green-500 from-green-50/70 to-white dark:border-green-900/50 dark:border-t-green-500 dark:from-green-950/20 dark:to-slate-800",
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
            color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400",
            cardClasses: "border-amber-100/50 border-t-amber-500 from-amber-50/70 to-white dark:border-amber-900/50 dark:border-t-amber-500 dark:from-amber-950/20 dark:to-slate-800",
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
            color: "text-sky-600 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-400",
            cardClasses: "border-sky-100/50 border-t-sky-500 from-sky-50/70 to-white dark:border-sky-900/50 dark:border-t-sky-500 dark:from-sky-950/20 dark:to-slate-800",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className={`group relative min-h-[170px] rounded-3xl border border-t-[3px] bg-gradient-to-br shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden p-7 ${card.cardClasses}`}
                    >
                        <span className="absolute top-5 right-7 inline-flex items-center gap-1.5 rounded-full bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {t("live", "Live")}
                        </span>

                        <div className="flex items-start justify-between gap-4">
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                                {card.title}
                            </p>

                            <div
                                className={`h-16 w-16 shrink-0 rounded-2xl shadow-sm dark:shadow-none flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${card.color}`}
                            >
                                <Icon size={28} />
                            </div>
                        </div>

                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-4">
                            {card.value}
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            {card.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default AnalyticsOverview;