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
            icon: Users,
            color: "text-indigo-600 bg-indigo-100",
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
            icon: TrendingUp,
            color: "text-green-600 bg-green-100",
        },
        {
            title: t(
                "active_employees",
                "Active Employees"
            ),
            value:
                analytics.active_employees ??
                0,
            icon: Clock3,
            color: "text-amber-600 bg-amber-100",
        },
        {
            title: t(
                "inactive_employees",
                "Inactive Employees"
            ),
            value:
                analytics.inactive_employees ??
                0,
            icon: Globe,
            color: "text-sky-600 bg-sky-100",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-slate-500 text-sm">
                                    {card.title}
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color}`}
                            >
                                <Icon size={22} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default AnalyticsOverview;