import {
  FiClock,
  FiTrendingDown,
  FiMoon,
  FiGlobe,
  FiRepeat,
  FiTarget,
} from "react-icons/fi";

const parseTimeToSeconds = (time) => {
  if (!time) return 0;

  const parts = time.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = parseFloat(parts[2]);

  return hours * 3600 + minutes * 60 + seconds;
};

const formatTime = (time) => {
  if (!time) return "0m";

  const totalSeconds = parseTimeToSeconds(time);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

export default function SummaryCards({ analytics }) {
  const productive = parseTimeToSeconds(analytics.productive_time);
  const nonProductive = parseTimeToSeconds(analytics.non_productive_time);
  const idle = parseTimeToSeconds(analytics.idle_time);

  const total = productive + nonProductive + idle;

  const focusScore =
    total === 0 ? 0 : Math.round((productive / total) * 100);

  const cards = [
    {
      title: "Productive",
      value: formatTime(analytics.productive_time),
      icon: <FiClock />,
      color: "bg-blue-500",
    },
    {
      title: "Non Productive",
      value: formatTime(analytics.non_productive_time),
      icon: <FiTrendingDown />,
      color: "bg-red-500",
    },
    {
      title: "Idle",
      value: formatTime(analytics.idle_time),
      icon: <FiMoon />,
      color: "bg-yellow-500",
    },
    {
      title: "Websites",
      value: analytics.total_websites_visited,
      icon: <FiGlobe />,
      color: "bg-purple-500",
    },
    {
      title: "Tab Switches",
      value: analytics.total_tab_switches,
      icon: <FiRepeat />,
      color: "bg-orange-500",
    },
    {
      title: "Focus Score",
      value: `${focusScore}%`,
      icon: <FiTarget />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white ${card.color}`}
          >
            {card.icon}
          </div>

          <p className="mt-4 text-sm text-gray-500">{card.title}</p>

          <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>
  );
}