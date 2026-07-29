import { useLanguage } from "../../context/useLanguage";

const formatTime = (time, t) => {
  if (!time) return `0${t("minutes_short", "m")}`;

  const [h, m] = time.split(":");

  if (Number(h) > 0)
    return `${h}${t("hours_short", "h")} ${m}${t(
      "minutes_short",
      "m"
    )}`;

  return `${m}${t("minutes_short", "m")}`;
};

export default function ReportStats({ report }) {
  const { t } = useLanguage();

  if (!report) return null;

  const cards = [
    {
      title: t("focus_score", "Focus Score"),
      value: `${report.productivity_percentage}%`,
      color: "text-green-600",
    },
    {
      title: t("websites", "Websites"),
      value: report.websites_visited,
      color: "text-blue-600",
    },
    {
      title: t("tab_switches", "Tab Switches"),
      value: report.tab_switches,
      color: "text-orange-600",
    },
    {
      title: t("productive_time", "Productive Time"),
      value: formatTime(report.productive_time, t),
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className={`mt-2 text-3xl font-bold ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}