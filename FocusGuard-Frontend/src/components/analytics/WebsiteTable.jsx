const parseTime = (time) => {
  if (!time) return 0;

  const [h, m, s] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + parseFloat(s);
};

const formatTime = (time) => {
  const total = parseTime(time);

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);

  if (h > 0) return `${h}h ${m}m`;

  return `${m}m`;
};

export default function WebsiteTable({ analytics }) {
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
        Top Websites
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">
                Website
              </th>

              <th className="text-center">
                Visits
              </th>

              <th className="text-center">
                Time
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
                  {site.visits}
                </td>

                <td className="text-center">
                  {formatTime(site.time_spent)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}