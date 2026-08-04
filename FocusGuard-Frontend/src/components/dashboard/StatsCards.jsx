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
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className="truncate text-xs font-medium text-slate-500">
                {card.trend}
              </span>

              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {numberFormatter.format(productivePercentage)}%
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}