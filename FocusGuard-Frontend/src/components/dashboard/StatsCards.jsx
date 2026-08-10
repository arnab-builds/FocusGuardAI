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
      border: "border-t-emerald-500",
      iconBg: "bg-emerald-100/50 text-emerald-600 shadow-sm shadow-emerald-500/10",
      badgeColor: "bg-emerald-100/60 text-emerald-700",
      cardTint: "bg-gradient-to-br from-emerald-50/70 to-white",
      dividerColor: "border-emerald-100/50",
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
      border: "border-t-rose-500",
      iconBg: "bg-rose-100/50 text-rose-600 shadow-sm shadow-rose-500/10",
      badgeColor: "bg-rose-100/60 text-rose-700",
      cardTint: "bg-gradient-to-br from-rose-50/70 to-white",
      dividerColor: "border-rose-100/50",
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
      border: "border-t-amber-500",
      iconBg: "bg-amber-100/50 text-amber-600 shadow-sm shadow-amber-500/10",
      badgeColor: "bg-amber-100/60 text-amber-700",
      cardTint: "bg-gradient-to-br from-amber-50/70 to-white",
      dividerColor: "border-amber-100/50",
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
      border: "border-t-cyan-500",
      iconBg: "bg-cyan-100/50 text-cyan-600 shadow-sm shadow-cyan-500/10",
      badgeColor: "bg-cyan-100/60 text-cyan-700",
      cardTint: "bg-gradient-to-br from-cyan-50/70 to-white",
      dividerColor: "border-cyan-100/50",
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
      border: "border-t-indigo-500",
      iconBg: "bg-indigo-100/50 text-indigo-600 shadow-sm shadow-indigo-500/10",
      badgeColor: "bg-indigo-100/60 text-indigo-700",
      cardTint: "bg-gradient-to-br from-indigo-50/70 to-white",
      dividerColor: "border-indigo-100/50",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md border-t-[3px] ${card.border} ${card.cardTint}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {card.title}
                </p>

                <h2 className="mt-3 break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 group-hover:bg-opacity-80 ${card.iconBg}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className={`mt-5 flex items-center justify-between gap-3 border-t pt-4 ${card.dividerColor}`}>
              <span className="truncate text-xs font-medium text-slate-600">
                {card.trend}
              </span>

              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${card.badgeColor}`}>
                {numberFormatter.format(productivePercentage)}%
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}