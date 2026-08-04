export default function ProfileCard({ profile, analytics }) {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 text-4xl font-semibold text-white">
          {profile.username?.charAt(0) || "U"}
        </div>
        <div>
          <p className="text-sm text-slate-500">Quick profile</p>
          <h2 className="text-3xl font-semibold text-slate-900">{profile.username}</h2>
          {profile.role !== "NORMAL_USER" && (
            <p className="mt-1 text-sm text-slate-500">
              {profile.organization || "Not Assigned"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid flex-1 gap-4">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Productive time</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.productive_time}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Idle time</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{analytics.idle_time}</p>
        </div>
      </div>
    </section>
  );
}
