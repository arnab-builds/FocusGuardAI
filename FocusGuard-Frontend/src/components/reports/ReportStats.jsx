const formatTime = (time) => {
  if (!time) return "0m";

  const [h, m] = time.split(":");

  if (Number(h) > 0)
    return `${h}h ${m}m`;

  return `${m}m`;
};

export default function ReportStats({ report }) {
  if (!report) return null;

  const cards = [
    {
      title: "Focus Score",
      value: `${report.productivity_percentage}%`,
      color: "text-green-600",
    },
    {
      title: "Websites",
      value: report.websites_visited,
      color: "text-blue-600",
    },
    {
      title: "Tab Switches",
      value: report.tab_switches,
      color: "text-orange-600",
    },
    {
      title: "Productive Time",
      value: formatTime(report.productive_time),
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <p className="text-gray-500 text-sm">
            {card.title}
          </p>

          <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}