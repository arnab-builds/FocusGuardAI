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
      type: "daily",
      icon: <FiCalendar size={26} />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t("weekly_report", "Weekly Report"),
      type: "weekly",
      icon: <FiBarChart2 size={26} />,
      color: "from-green-500 to-green-600",
    },
    {
      title: t("monthly_report", "Monthly Report"),
      type: "monthly",
      icon: <FiTrendingUp size={26} />,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reports.map((report) => (
        <div
          key={report.type}
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg"
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${report.color} text-white`}
          >
            {report.icon}
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            {report.title}
          </h2>

          <button
            onClick={() => onGenerate(report.type)}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
          >
            {t("generate_report", "Generate Report")}
          </button>
        </div>
      ))}
    </div>
  );
}