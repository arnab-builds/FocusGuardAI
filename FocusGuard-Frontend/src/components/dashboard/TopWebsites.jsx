import { FiArrowRight } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const parseDurationToSeconds = (time) => {
  if (!time) return 0;

  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

export default function TopWebsites({ websiteSummary }) {
  const { currentLanguageCode, t } = useLanguage();

  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const websites = Object.entries(websiteSummary || {}).map(
    ([name, data]) => ({
      name,
      duration: parseDurationToSeconds(data.time_spent),
      visits: data.visits,
    })
  );

  const sorted = websites
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  const maxDuration = sorted[0]?.duration || 1;

  return (
    <section className="flex h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("top_websites", "Top Websites")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {t("top_5_domains", "Top 5 Domains")}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <FiArrowRight size={18} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t(
              "no_website_activity_available",
              "No website activity available."
            )}
          </p>
        ) : (
          sorted.map((website) => {
            const ratio = Math.max(
              12,
              Math.round((website.duration / maxDuration) * 100)
            );

            return (
              <div
                key={website.name}
                className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold text-slate-900">
                    {website.name}
                  </span>

                  <span className="text-sm text-slate-500">
                    {numberFormatter.format(website.visits)}{" "}
                    {t("visits", "visits")}
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {numberFormatter.format(
                    Math.round(website.duration / 60)
                  )}{" "}
                  {t("minutes_short", "min")}
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}