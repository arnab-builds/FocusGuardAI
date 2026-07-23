import { FiTarget, FiTrendingUp, FiAward } from "react-icons/fi";

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
            Weekly summary
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Goal & streak</h2>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <FiTrendingUp size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Focus score</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{focusScore}%</p>
              <p className="mt-2 text-sm text-slate-500">Higher is better.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <FiTarget size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Goal progress</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{goalProgress}%</p>
              <p className="mt-2 text-sm text-slate-500">Toward 5h focus goal.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
              <FiAward size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Flow streak</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{streak} days</p>
              <p className="mt-2 text-sm text-slate-500">Consecutive active days.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-100 p-5 text-sm text-slate-600">
        <p>
          This summary helps you see the most important progress signals at a glance, without diving into detailed analytics.
        </p>
      </div>
    </section>
  );
}
