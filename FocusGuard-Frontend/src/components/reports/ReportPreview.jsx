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

export default function ReportPreview({ report }) {
  const { t } = useLanguage();

  if (!report)
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold">
          {t("no_report_selected", "No Report Selected")}
        </h2>

        <p className="mt-3 text-gray-500">
          {t(
            "generate_report_to_preview",
            "Generate a report to preview it."
          )}
        </p>
      </div>
    );

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        {t("report_preview", "Report Preview")}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        <Info
          title={t("productive_time", "Productive Time")}
          value={formatTime(report.productive_time, t)}
        />

        <Info
          title={t("non_productive", "Non Productive")}
          value={formatTime(report.non_productive_time, t)}
        />

        <Info
          title={t("neutral", "Neutral")}
          value={formatTime(report.neutral_time, t)}
        />

        <Info
          title={t("idle", "Idle")}
          value={formatTime(report.idle_time, t)}
        />

        <Info
          title={t("websites", "Websites")}
          value={report.websites_visited}
        />

        <Info
          title={t("tab_switches", "Tab Switches")}
          value={report.tab_switches}
        />

        <Info
          title={t("focus_score", "Focus Score")}
          value={`${report.productivity_percentage}%`}
        />
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-gray-500">
        {title}
      </p>

      <h3 className="mt-1 text-xl font-bold">
        {value}
      </h3>
    </div>
  );
}