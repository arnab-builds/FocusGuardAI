import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import { useLanguage } from "../../context/useLanguage";

function DashboardCards({ analytics }) {
    const { t } = useLanguage();

    const cards = [
        {
            title: t(
                "total_employees",
                "Total Employees"
            ),
            value: analytics.total_employees || 0,
            subtitle: t(
                "organization_users",
                "Organization users"
            ),
            cardClasses: "border-indigo-100/50 border-t-indigo-500 from-indigo-50/70 to-white",
            color: "bg-indigo-50 text-indigo-600",
            icon: (
                <GroupsRoundedIcon fontSize="small" />
            ),
        },
        {
            title: t(
                "active_employees",
                "Active Employees"
            ),
            value: analytics.active_employees || 0,
            subtitle: t(
                "active_accounts",
                "Active accounts"
            ),
            cardClasses: "border-emerald-100/50 border-t-emerald-500 from-emerald-50/70 to-white",
            color: "bg-emerald-50 text-emerald-600",
            icon: (
                <PersonRoundedIcon fontSize="small" />
            ),
        },
        {
            title: t(
                "inactive_employees",
                "Inactive Employees"
            ),
            value:
                analytics.inactive_employees || 0,
            subtitle: t(
                "inactive_accounts",
                "Inactive accounts"
            ),
            cardClasses: "border-rose-100/50 border-t-rose-500 from-rose-50/70 to-white",
            color: "bg-rose-50 text-rose-600",
            icon: (
                <PersonOffRoundedIcon fontSize="small" />
            ),
        },
        {
            title: t(
                "productivity",
                "Productivity"
            ),
            value: `${
                analytics.productive_percentage || 0
            }%`,
            subtitle: t(
                "overall_score",
                "Overall score"
            ),
            cardClasses: "border-amber-100/50 border-t-amber-500 from-amber-50/70 to-white",
            color: "bg-amber-50 text-amber-600",
            icon: (
                <TrendingUpRoundedIcon fontSize="small" />
            ),
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`rounded-[18px] border border-t-[3px] bg-gradient-to-br p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md ${card.cardClasses}`}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">
                                {card.title}
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                                {card.value}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {card.subtitle}
                            </p>
                        </div>

                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}
                        >
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardCards;