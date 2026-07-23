import { FiCpu, FiZap } from "react-icons/fi";

export default function AISummary({
  onAnalyze,
  loading,
  recommendation,
}) {
  return (
    <section className="flex min-h-[320px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            AI Coach
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Recommendation
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <FiCpu size={18} />
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="mt-4 flex flex-1 flex-col justify-between rounded-xl bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Insight
            </p>

            <p className="mt-1 truncate text-lg font-semibold text-slate-900">
              {recommendation?.title || "No recommendation yet"}
            </p>
          </div>

          <span className="flex-shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {recommendation?.recommendation_type || "Idle"}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600 break-words">
          {recommendation?.message ||
            "Click the button below to generate an AI recommendation based on today's activity."}
        </p>

        <button
          onClick={onAnalyze}
          disabled={loading}
          className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <FiZap size={16} />

          {loading ? "Generating..." : "Generate Recommendation"}
        </button>
      </div>
    </section>
  );
}