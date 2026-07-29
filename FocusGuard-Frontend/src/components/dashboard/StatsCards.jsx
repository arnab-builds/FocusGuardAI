import {
  FiTrendingUp,
  FiSlash,
  FiZap,
  FiGlobe,
  FiRefreshCcw,
} from "react-icons/fi";
import { formatDuration } from "../../utils/timeFormatter";
import { useLanguage } from "../../context/useLanguage";

const parseDurationToSeconds = (time) => {
  if (!time) return 0;

  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

export default function StatsCards({ analytics }) {
  const { currentLanguageCode, t } = useLanguage();

  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const idleSeconds = parseDurationToSeconds(
    analytics.idle_time
  );

  const productivePercentage =
    Number(analytics.productivity_percentage) || 0;

  const cards = [
    {
      title: t("productive", "Productive"),
      value: formatDuration(
        analytics.productive_time,
        t,
        currentLanguageCode
      ),
      icon: FiTrendingUp,
      trend:
        productivePercentage >= 50
          ? t("stable", "Stable")
          : t("needs_focus", "Needs Focus"),
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: t("non_productive", "Non Productive"),
      value: formatDuration(
        analytics.non_productive_time,
        t,
        currentLanguageCode
      ),
      icon: FiSlash,
      trend:
        productivePercentage < 50
          ? t("watch", "Watch")
          : t("contained", "Contained"),
      color: "from-rose-400 to-red-500",
    },
    {
      title: t("idle", "Idle"),
      value: formatDuration(
        analytics.idle_time,
        t,
        currentLanguageCode
      ),
      icon: FiZap,
      trend:
        idleSeconds > 0
          ? t("recorded", "Recorded")
          : t("none", "None"),
      color: "from-sky-400 to-indigo-500",
    },
    {
      title: t("websites", "Websites"),
      value: numberFormatter.format(
        analytics.total_websites_visited ?? 0
      ),
      icon: FiGlobe,
      trend:
        analytics.total_websites_visited > 0
          ? t("active", "Active")
          : t("empty", "Empty"),
      color: "from-violet-400 to-fuchsia-500",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: numberFormatter.format(
        analytics.total_tab_switches ?? 0
      ),
      icon: FiRefreshCcw,
      trend:
        analytics.total_tab_switches > 20
          ? t("busy", "Busy")
          : t("smooth", "Smooth"),
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
                {numberFormatter.format(productivePercentage)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
