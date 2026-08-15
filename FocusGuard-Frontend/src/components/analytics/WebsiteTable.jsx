import { useLanguage } from "../../context/useLanguage";
import WebsiteIcon from "../common/WebsiteIcon";

const parseTime = (time) => {
  if (!time) return 0;

  const [h, m, s] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + parseFloat(s);
};

const formatTime = (time, t, locale) => {
  const total = parseTime(time);
  const numberFormatter = new Intl.NumberFormat(locale || undefined);

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);

  if (h > 0) {
    return `${numberFormatter.format(h)}${t(
      "hours_short",
      "h"
    )} ${numberFormatter.format(m)}${t(
      "minutes_short",
      "m"
    )}`;
  }

  return `${numberFormatter.format(m)}${t(
    "minutes_short",
    "m"
  )}`;
};

export default function WebsiteTable({ analytics }) {
  const { currentLanguageCode, t } = useLanguage();

  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const websites = Object.entries(
    analytics.website_summary || {}
  )
    .map(([name, data]) => ({
      name,
      ...data,
      seconds: parseTime(data.time_spent),
    }))
    .sort((a, b) => b.seconds - a.seconds);

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-100/50 dark:border-slate-700 bg-cyan-50/30 dark:bg-slate-800 p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 sm:text-2xl">
          {t("top_websites", "Top Websites")}
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t(
            "website_usage_statistics",
            "Website usage statistics based on your activity."
          )}
        </p>
      </div>

      {websites.length === 0 ? (
        <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {t(
            "no_website_activity_available",
            "No website activity available."
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {t("website", "Website")}
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {t("visits", "Visits")}
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {t("time", "Time")}
                </th>
              </tr>
            </thead>

            <tbody>
              {websites.map((site, index) => (
                <tr
                  key={site.name}
                  className={`transition-all duration-200 hover:bg-cyan-50/50 dark:hover:bg-[#1f2b45] hover:shadow-sm ${
                    index !== websites.length - 1
                      ? "border-b border-slate-100 dark:border-slate-700/50"
                      : ""
                  }`}
                >
                  <td className="max-w-xs px-5 py-4 font-medium text-slate-900 dark:text-slate-50">
                    <div className="flex min-w-0 items-center gap-2">
                      <WebsiteIcon faviconUrl={site.favicon_url} websiteUrl={site.url} websiteName={site.name} className="h-8 w-8" />
                      <span className="truncate">{site.name}</span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-center text-slate-700 dark:text-slate-300">
                    {numberFormatter.format(site.visits)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-center font-semibold text-slate-900 dark:text-slate-50">
                    {formatTime(
                      site.time_spent,
                      t,
                      currentLanguageCode
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
