import { useLanguage } from "../../context/useLanguage";

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
    analytics.website_summary
  )
    .map(([name, data]) => ({
      name,
      ...data,
      seconds: parseTime(data.time_spent),
    }))
    .sort((a, b) => b.seconds - a.seconds);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        {t("top_websites", "Top Websites")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">
                {t("website", "Website")}
              </th>

              <th className="text-center">
                {t("visits", "Visits")}
              </th>

              <th className="text-center">
                {t("time", "Time")}
              </th>
            </tr>
          </thead>

          <tbody>
            {websites.map((site) => (
              <tr
                key={site.name}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-4">
                  {site.name}
                </td>

                <td className="text-center">
                  {numberFormatter.format(site.visits)}
                </td>

                <td className="text-center">
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
    </div>
  );
}