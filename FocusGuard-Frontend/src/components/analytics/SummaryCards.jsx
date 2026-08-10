import {
  FiClock,
  FiTrendingDown,
  FiMoon,
  FiGlobe,
  FiRepeat,
  FiTarget,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const formatTime = (time, t, locale) => {
  const numberFormatter = new Intl.NumberFormat(locale || undefined);

  if (!time) {
    return `${numberFormatter.format(0)}${t(
      "minutes_short",
      "m"
    )}`;
  }

  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(".")[0]
    .split(":")
    .map(Number);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hrs > 0) {
    return `${numberFormatter.format(hrs)}${t(
      "hours_short",
      "h"
    )} ${numberFormatter.format(mins)}${t(
      "minutes_short",
      "m"
    )}`;
  }

  return `${numberFormatter.format(mins)}${t(
    "minutes_short",
    "m"
  )}`;
};

export default function SummaryCards({ analytics }) {
  const { currentLanguageCode, t } = useLanguage();

  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const focusScore = Number(analytics.productivity_percentage) || 0;

  const cards = [
    {
      title: t("productive", "Productive"),
      value: formatTime(
        analytics.productive_time,
        t,
        currentLanguageCode
      ),
      icon: <FiClock className="h-6 w-6" />,
      border: "border-t-[3px] border-t-emerald-500",
      iconBg: "bg-emerald-100/50 text-emerald-600 shadow-sm shadow-emerald-500/10",
      cardTint: "bg-gradient-to-br from-emerald-50/70 to-white",
      dividerColor: "border-emerald-100/50",
    },
    {
      title: t("non_productive", "Non Productive"),
      value: formatTime(
        analytics.non_productive_time,
        t,
        currentLanguageCode
      ),
      icon: <FiTrendingDown className="h-6 w-6" />,
      border: "border-t-[3px] border-t-rose-500",
      iconBg: "bg-rose-100/50 text-rose-600 shadow-sm shadow-rose-500/10",
      cardTint: "bg-gradient-to-br from-rose-50/70 to-white",
      dividerColor: "border-rose-100/50",
    },
    {
      title: t("idle", "Idle"),
      value: formatTime(
        analytics.idle_time,
        t,
        currentLanguageCode
      ),
      icon: <FiMoon className="h-6 w-6" />,
      border: "border-t-[3px] border-t-amber-500",
      iconBg: "bg-amber-100/50 text-amber-600 shadow-sm shadow-amber-500/10",
      cardTint: "bg-gradient-to-br from-amber-50/70 to-white",
      dividerColor: "border-amber-100/50",
    },
    {
      title: t("websites", "Websites"),
      value: numberFormatter.format(
        analytics.total_websites_visited
      ),
      icon: <FiGlobe className="h-6 w-6" />,
      border: "border-t-[3px] border-t-cyan-500",
      iconBg: "bg-cyan-100/50 text-cyan-600 shadow-sm shadow-cyan-500/10",
      cardTint: "bg-gradient-to-br from-cyan-50/70 to-white",
      dividerColor: "border-cyan-100/50",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: numberFormatter.format(
        analytics.total_tab_switches
      ),
      icon: <FiRepeat className="h-6 w-6" />,
      border: "border-t-[3px] border-t-indigo-500",
      iconBg: "bg-indigo-100/50 text-indigo-600 shadow-sm shadow-indigo-500/10",
      cardTint: "bg-gradient-to-br from-indigo-50/70 to-white",
      dividerColor: "border-indigo-100/50",
    },
    {
      title: t("focus_score", "Focus Score"),
      value: `${numberFormatter.format(focusScore)}%`,
      icon: <FiTarget className="h-6 w-6" />,
      border: "border-t-[3px] border-t-blue-500",
      iconBg: "bg-blue-100/50 text-blue-600 shadow-sm shadow-blue-500/10",
      cardTint: "bg-gradient-to-br from-blue-50/70 to-white",
      dividerColor: "border-blue-100/50",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.cardTint} ${card.border}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {card.title}
              </p>

              <h2 className="mt-3 break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          <div className={`mt-5 border-t pt-4 ${card.dividerColor}`}>
            <span className="text-xs font-medium text-slate-600">
              {t("summary", "Summary")}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}