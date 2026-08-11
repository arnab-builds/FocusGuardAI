import {
  FiTarget,
  FiGlobe,
  FiRepeat,
  FiClock,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const formatTime = (time, t) => {
  if (!time) return `0${t("minutes_short", "m")}`;

  const [h, m] = time.split(":");

  if (Number(h) > 0)
    return `${h}${t("hours_short", "h")} ${m}${t(
      "minutes_short",
      "m"
    )}`;

  return `${m}${t("minutes_short", "m")}`;
};

export default function ReportStats({ report }) {
  const { t } = useLanguage();

  if (!report) return null;

  const cards = [
    {
      title: t("focus_score", "Focus Score"),
      value: `${report.productivity_percentage}%`,
      icon: <FiTarget className="h-6 w-6" />,
      iconBg: "bg-emerald-100/50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10",
      cardTint: "bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-[#111827] border-emerald-100/50 dark:border-slate-700/50 border-t-[3px] border-t-emerald-500",
    },
    {
      title: t("websites", "Websites"),
      value: report.websites_visited,
      icon: <FiGlobe className="h-6 w-6" />,
      iconBg: "bg-blue-100/50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10",
      cardTint: "bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/30 dark:to-[#111827] border-blue-100/50 dark:border-slate-700/50 border-t-[3px] border-t-blue-500",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: report.tab_switches,
      icon: <FiRepeat className="h-6 w-6" />,
      iconBg: "bg-amber-100/50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-500/10",
      cardTint: "bg-gradient-to-br from-amber-50/70 to-white dark:from-amber-950/30 dark:to-[#111827] border-amber-100/50 dark:border-slate-700/50 border-t-[3px] border-t-amber-500",
    },
    {
      title: t("productive_time", "Productive Time"),
      value: formatTime(report.productive_time, t),
      icon: <FiClock className="h-6 w-6" />,
      iconBg: "bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10",
      cardTint: "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] border-indigo-100/50 dark:border-slate-700/50 border-t-[3px] border-t-indigo-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`flex min-h-[170px] flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md ${card.cardTint}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {card.title}
              </p>

              <h2 className="mt-3 break-words text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100/80 dark:border-slate-700/50 pt-4">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {t("report_summary", "Report Summary")}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}