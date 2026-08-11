import { FiTarget, FiTrendingUp, FiAward } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

const parseDurationToSeconds = (time) => {
  if (!time) return 0;
  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
};

const getStreak = (activities) => {
  if (!activities || activities.length === 0) return 0;
  const dates = Array.from(
    new Set(
      activities
        .map((activity) => activity.start_time)
        .filter(Boolean)
        .map((startTime) => new Date(startTime).toISOString().slice(0, 10))
    )
  ).sort();

  if (dates.length === 0) return 0;

  let streak = 0;
  let cursor = new Date(dates[dates.length - 1]);
  const dateSet = new Set(dates);

  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export default function SummaryOverview({ analytics, activities }) {
  const { t } = useLanguage();
  const productiveSeconds = parseDurationToSeconds(analytics.productive_time);
  const nonProductiveSeconds = parseDurationToSeconds(analytics.non_productive_time);
  const idleSeconds = parseDurationToSeconds(analytics.idle_time);
  const totalSeconds = productiveSeconds + nonProductiveSeconds + idleSeconds || 1;
  const focusScore = Math.round((productiveSeconds / totalSeconds) * 100);
  const goalProgress = Math.min(100, Math.round((productiveSeconds / (5 * 3600)) * 100));
  const streak = getStreak(activities);

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
            {t("weekly_summary")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">{t("goal_and_streak")}</h2>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <FiTrendingUp size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("focus_score")}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{focusScore}%</p>
              <p className="mt-2 text-sm text-slate-500">{t("higher_is_better")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <FiTarget size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("goal_progress")}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{goalProgress}%</p>
              <p className="mt-2 text-sm text-slate-500">{t("toward_focus_goal")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
              <FiAward size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("flow_streak")}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{streak} days</p>
              <p className="mt-2 text-sm text-slate-500">{t("consecutive_active_days")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-100 p-5 text-sm text-slate-600">
        <p>
          {t("dashboard_summary_description")}
        </p>
      </div>
    </section>
  );
}
