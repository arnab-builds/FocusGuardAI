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
      <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          {t("no_report_selected", "No Report Selected")}
        </h2>

        <p className="mt-3 text-slate-500">
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
      color: "from-emerald-500 to-green-600",
    },
    {
      title: t("non_productive", "Non Productive"),
      value: formatTime(report.non_productive_time, t),
      icon: <FiTrendingDown className="h-6 w-6" />,
      color: "from-red-500 to-rose-600",
    },
    {
      title: t("neutral", "Neutral"),
      value: formatTime(report.neutral_time, t),
      icon: <FiMoon className="h-6 w-6" />,
      color: "from-slate-500 to-slate-700",
    },
    {
      title: t("idle", "Idle"),
      value: formatTime(report.idle_time, t),
      icon: <FiClock className="h-6 w-6" />,
      color: "from-amber-500 to-yellow-600",
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
      title: t("focus_score", "Focus Score"),
      value: `${report.productivity_percentage}%`,
      icon: <FiTarget className="h-6 w-6" />,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {t("report_preview", "Report Preview")}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
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
            className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-indigo-200 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {item.title}
                </p>

                <h3 className="mt-3 break-words text-2xl font-bold text-slate-900">
                  {item.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
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