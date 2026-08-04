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
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t("weekly_report", "Weekly Report"),
      description: t(
        "weekly_report_description",
        "Review your performance over the last 7 days."
      ),
      type: "weekly",
      icon: <FiBarChart2 className="h-7 w-7" />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: t("monthly_report", "Monthly Report"),
      description: t(
        "monthly_report_description",
        "Get a complete overview of your monthly productivity."
      ),
      type: "monthly",
      icon: <FiTrendingUp className="h-7 w-7" />,
      color: "from-violet-500 to-violet-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <div
          key={report.type}
          className="flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${report.color} text-white shadow-md`}
          >
            {report.icon}
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {report.title}
          </h2>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
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