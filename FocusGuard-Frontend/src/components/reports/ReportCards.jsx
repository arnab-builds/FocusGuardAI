import {
  FiCalendar,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function ReportCards({ onGenerate }) {
  const { t } = useLanguage();

  const reports = [
    {
      title: t("daily_report", "Daily Report"),
      description: t(
        "daily_report_description",
        "Analyze today's productivity and activity."
      ),
      type: "daily",
      icon: <FiCalendar className="h-7 w-7" />,
      iconBg: "bg-blue-100/50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10",
      cardTint: "bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/30 dark:to-[#111827] border-blue-100/50 dark:border-slate-700/50 border-t-[3px] border-t-blue-500",
    },
    {
      title: t("weekly_report", "Weekly Report"),
      description: t(
        "weekly_report_description",
        "Review your performance over the last 7 days."
      ),
      type: "weekly",
      icon: <FiBarChart2 className="h-7 w-7" />,
      iconBg: "bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10",
      cardTint: "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] border-indigo-100/50 dark:border-slate-700/50 border-t-[3px] border-t-indigo-500",
    },
    {
      title: t("monthly_report", "Monthly Report"),
      description: t(
        "monthly_report_description",
        "Get a complete overview of your monthly productivity."
      ),
      type: "monthly",
      icon: <FiTrendingUp className="h-7 w-7" />,
      iconBg: "bg-cyan-100/50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 shadow-sm shadow-cyan-500/10",
      cardTint: "bg-gradient-to-br from-cyan-50/70 to-white dark:from-cyan-950/30 dark:to-[#111827] border-cyan-100/50 dark:border-slate-700/50 border-t-[3px] border-t-cyan-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <div
          key={report.type}
          className={`flex min-h-[240px] flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md ${report.cardTint}`}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ${report.iconBg}`}
          >
            {report.icon}
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50">
            {report.title}
          </h2>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {report.description}
          </p>

          <button
            onClick={() => onGenerate(report.type)}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98]"
          >
            {t("generate_report", "Generate Report")}
          </button>
        </div>
      ))}
    </section>
  );
}