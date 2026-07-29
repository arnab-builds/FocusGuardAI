import { FiClock } from "react-icons/fi";
import { formatDuration } from "../../utils/timeFormatter";
import { useLanguage } from "../../context/useLanguage";

export default function RecentActivity({ activities }) {
  const { currentLanguageCode, t } = useLanguage();

  const recentItems = activities.slice(0, 5);

  return (
    <section className="flex h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("recent_activity", "Recent Activity")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {t("latest_sessions", "Latest Sessions")}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <FiClock size={18} />
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {recentItems.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t(
              "no_recent_activity_available",
              "No recent activity available."
            )}
          </p>
        ) : (
          recentItems.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <FiClock size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {activity.website_name ||
                      activity.website_url ||
                      t("unknown", "Unknown")}
                  </p>

                  <p className="text-xs text-slate-500">
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

              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold text-slate-900">
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