import {
  FiTrendingUp,
  FiSlash,
  FiZap,
  FiGlobe,
  FiRefreshCcw,
} from "react-icons/fi";
import { formatDuration } from "../../utils/timeFormatter";

const parseDurationToSeconds = (time) => {
  if (!time) return 0;

  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

export default function StatsCards({ analytics }) {
  const productiveSeconds = parseDurationToSeconds(
    analytics.productive_time
  );
  const nonProductiveSeconds = parseDurationToSeconds(
    analytics.non_productive_time
  );
  const idleSeconds = parseDurationToSeconds(analytics.idle_time);

  const totalActivitySeconds =
    productiveSeconds + nonProductiveSeconds + idleSeconds;

  const productivePercentage =
    totalActivitySeconds > 0
      ? Math.round((productiveSeconds / totalActivitySeconds) * 100)
      : 0;

  const cards = [
    {
      title: "Productive",
      value: formatDuration(analytics.productive_time),
      icon: FiTrendingUp,
      trend:
        productiveSeconds >= nonProductiveSeconds
          ? "Stable"
          : "Needs Focus",
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: "Non Productive",
      value: formatDuration(analytics.non_productive_time),
      icon: FiSlash,
      trend:
        nonProductiveSeconds > productiveSeconds
          ? "Watch"
          : "Contained",
      color: "from-rose-400 to-red-500",
    },
    {
      title: "Idle",
      value: formatDuration(analytics.idle_time),
      icon: FiZap,
      trend: idleSeconds > 0 ? "Recorded" : "None",
      color: "from-sky-400 to-indigo-500",
    },
    {
      title: "Websites",
      value: analytics.total_websites_visited ?? 0,
      icon: FiGlobe,
      trend:
        analytics.total_websites_visited > 0
          ? "Active"
          : "Empty",
      color: "from-violet-400 to-fuchsia-500",
    },
    {
      title: "Tab Switches",
      value: analytics.total_tab_switches ?? 0,
      icon: FiRefreshCcw,
      trend:
        analytics.total_tab_switches > 20
          ? "Busy"
          : "Smooth",
      color: "from-slate-400 to-slate-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-slate-500">
                {card.trend}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {productivePercentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}