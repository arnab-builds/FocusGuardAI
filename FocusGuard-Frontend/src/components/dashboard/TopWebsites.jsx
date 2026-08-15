import { FiArrowRight } from "react-icons/fi";
import WebsiteIcon from "../common/WebsiteIcon";
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
      websiteUrl: data.url,
      faviconUrl: data.favicon_url,
      duration: parseDurationToSeconds(data.time_spent),
      visits: data.visits,
    })
  );

  const sorted = websites
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  const maxDuration = sorted[0]?.duration || 1;

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-cyan-100/50 dark:border-slate-700 bg-cyan-50/30 dark:bg-slate-800 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[2px]">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            {t("top_websites", "Top Websites")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {t("top_5_domains", "Top 5 Domains")}
          </h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100/50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 shadow-sm shadow-cyan-500/10 transition-colors duration-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/60">
          <FiArrowRight className="h-6 w-6 text-slate-700 dark:text-cyan-400" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {t(
              "no_website_activity_available",
              "No website activity available."
            )}
          </div>
        ) : (
          sorted.map((website) => {
            const ratio = Math.max(
              12,
              Math.round((website.duration / maxDuration) * 100)
            );

            return (
              <div
                key={website.name}
                className="rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-[#172033] p-4 transition-all duration-200 hover:border-cyan-200 dark:hover:border-cyan-500/30 hover:bg-cyan-50/30 dark:hover:bg-[#1f2b45] hover:shadow-sm hover:-translate-y-[1px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <WebsiteIcon faviconUrl={website.faviconUrl} websiteUrl={website.websiteUrl} websiteName={website.name} className="h-8 w-8" />
                    <span className="max-w-[70%] truncate text-sm font-semibold text-slate-900 dark:text-slate-50 sm:text-base">{website.name}</span>
                  </div>

                  <span className="shrink-0 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    {numberFormatter.format(website.visits)}{" "}
                    {t("visits", "visits")}
                  </span>
                </div>

                <div className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                  {numberFormatter.format(
                    Math.round(website.duration / 60)
                  )}{" "}
                  {t("minutes_short", "min")}
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 transition-all duration-500"
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
