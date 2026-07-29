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
      icon: <FiClock />,
      color: "bg-blue-500",
    },
    {
      title: t("non_productive", "Non Productive"),
      value: formatTime(
        analytics.non_productive_time,
        t,
        currentLanguageCode
      ),
      icon: <FiTrendingDown />,
      color: "bg-red-500",
    },
    {
      title: t("idle", "Idle"),
      value: formatTime(
        analytics.idle_time,
        t,
        currentLanguageCode
      ),
      icon: <FiMoon />,
      color: "bg-yellow-500",
    },
    {
      title: t("websites", "Websites"),
      value: numberFormatter.format(
        analytics.total_websites_visited
      ),
      icon: <FiGlobe />,
      color: "bg-purple-500",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: numberFormatter.format(
        analytics.total_tab_switches
      ),
      icon: <FiRepeat />,
      color: "bg-orange-500",
    },
    {
      title: t("focus_score", "Focus Score"),
      value: `${numberFormatter.format(focusScore)}%`,
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

          <p className="mt-4 text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
