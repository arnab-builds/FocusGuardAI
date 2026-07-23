import {
  FiCalendar,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";

export default function ReportCards({ onGenerate }) {
  const reports = [
    {
      title: "Daily Report",
      type: "daily",
      icon: <FiCalendar size={26} />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Weekly Report",
      type: "weekly",
      icon: <FiBarChart2 size={26} />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Monthly Report",
      type: "monthly",
      icon: <FiTrendingUp size={26} />,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.type}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6"
        >
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-r ${report.color} flex items-center justify-center text-white`}
          >
            {report.icon}
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            {report.title}
          </h2>

          <button
            onClick={() => onGenerate(report.type)}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            Generate Report
          </button>
        </div>
      ))}
    </div>
  );
}