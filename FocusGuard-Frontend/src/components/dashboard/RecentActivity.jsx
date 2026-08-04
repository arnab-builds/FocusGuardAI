import { FiClock } from "react-icons/fi";
import { formatDuration } from "../../utils/timeFormatter";
import { useLanguage } from "../../context/useLanguage";

export default function RecentActivity({ activities }) {
  const { currentLanguageCode, t } = useLanguage();

  const recentItems = activities.slice(0, 5);

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("recent_activity", "Recent Activity")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {t("latest_sessions", "Latest Sessions")}
          </h2>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <FiClock className="h-6 w-6 text-slate-700" />
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {recentItems.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
            {t(
              "no_recent_activity_available",
              "No recent activity available."
            )}
          </div>
        ) : (
          recentItems.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-slate-100 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <FiClock className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                    {activity.website_name ||
                      activity.website_url ||
                      t("unknown", "Unknown")}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {new Date(activity.start_time).toLocaleTimeString(
                      currentLanguageCode || undefined,
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <p className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm">
                  {activity.duration
                    ? formatDuration(
                        activity.duration,
                        t,
                        currentLanguageCode
                      )
                    : t("active", "Active")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}