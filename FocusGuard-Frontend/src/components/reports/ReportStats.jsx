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
      color: "from-emerald-500 to-green-600",
    },
    {
      title: t("websites", "Websites"),
      value: report.websites_visited,
      icon: <FiGlobe className="h-6 w-6" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: report.tab_switches,
      icon: <FiRepeat className="h-6 w-6" />,
      color: "from-orange-500 to-amber-600",
    },
    {
      title: t("productive_time", "Productive Time"),
      value: formatTime(report.productive_time, t),
      icon: <FiClock className="h-6 w-6" />,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-3 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <span className="text-xs font-medium text-slate-500">
              {t("report_summary", "Report Summary")}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}