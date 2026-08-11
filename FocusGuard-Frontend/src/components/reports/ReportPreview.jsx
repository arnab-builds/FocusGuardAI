import {
  FiClock,
  FiTrendingDown,
  FiMoon,
  FiGlobe,
  FiRepeat,
  FiTarget,
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

export default function ReportPreview({ report }) {
  const { t } = useLanguage();

  if (!report)
    return (
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {t("no_report_selected", "No Report Selected")}
        </h2>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          {t(
            "generate_report_to_preview",
            "Generate a report to preview it."
          )}
        </p>
      </section>
    );

  const items = [
    {
      title: t("productive_time", "Productive Time"),
      value: formatTime(report.productive_time, t),
      icon: <FiClock className="h-6 w-6" />,
      iconBg: "bg-emerald-100/50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10",
      cardTint: "bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-[#111827] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border-emerald-100/50 dark:border-slate-700/50 border-t-[3px] border-t-emerald-500",
    },
    {
      title: t("non_productive", "Non Productive"),
      value: formatTime(report.non_productive_time, t),
      icon: <FiTrendingDown className="h-6 w-6" />,
      iconBg: "bg-rose-100/50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-500/10",
      cardTint: "bg-gradient-to-br from-rose-50/70 to-white dark:from-rose-950/30 dark:to-[#111827] hover:bg-rose-50/50 dark:hover:bg-rose-950/20 border-rose-100/50 dark:border-slate-700/50 border-t-[3px] border-t-rose-500",
    },
    {
      title: t("neutral", "Neutral"),
      value: formatTime(report.neutral_time, t),
      icon: <FiMoon className="h-6 w-6" />,
      iconBg: "bg-slate-100/50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shadow-sm shadow-slate-500/10",
      cardTint: "bg-gradient-to-br from-slate-50/70 to-white dark:from-slate-900/50 dark:to-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700/50 border-t-[3px] border-t-slate-500",
    },
    {
      title: t("idle", "Idle"),
      value: formatTime(report.idle_time, t),
      icon: <FiClock className="h-6 w-6" />,
      iconBg: "bg-amber-100/50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-500/10",
      cardTint: "bg-gradient-to-br from-amber-50/70 to-white dark:from-amber-950/30 dark:to-[#111827] hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border-amber-100/50 dark:border-slate-700/50 border-t-[3px] border-t-amber-500",
    },
    {
      title: t("websites", "Websites"),
      value: report.websites_visited,
      icon: <FiGlobe className="h-6 w-6" />,
      iconBg: "bg-blue-100/50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10",
      cardTint: "bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/30 dark:to-[#111827] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border-blue-100/50 dark:border-slate-700/50 border-t-[3px] border-t-blue-500",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: report.tab_switches,
      icon: <FiRepeat className="h-6 w-6" />,
      iconBg: "bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10",
      cardTint: "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border-indigo-100/50 dark:border-slate-700/50 border-t-[3px] border-t-indigo-500",
    },
    {
      title: t("focus_score", "Focus Score"),
      value: `${report.productivity_percentage}%`,
      icon: <FiTarget className="h-6 w-6" />,
      iconBg: "bg-cyan-100/50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 shadow-sm shadow-cyan-500/10",
      cardTint: "bg-gradient-to-br from-cyan-50/70 to-white dark:from-cyan-950/30 dark:to-[#111827] hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 border-cyan-100/50 dark:border-slate-700/50 border-t-[3px] border-t-cyan-500",
    },
  ];

  return (
    <section className="rounded-2xl border border-blue-100/50 dark:border-slate-700/50 bg-gradient-to-br from-blue-50/30 to-white dark:from-slate-900/50 dark:to-slate-800/50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {t("report_preview", "Report Preview")}
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t(
            "report_preview_description",
            "Overview of the generated productivity report."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className={`flex min-h-[150px] flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md ${item.cardTint}`}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-3 break-words text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {item.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${item.iconBg}`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}