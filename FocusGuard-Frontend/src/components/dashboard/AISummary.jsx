import { FiCpu, FiZap } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function AISummary({
  onAnalyze,
  loading,
  recommendation,
}) {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("ai_coach", "AI Coach")}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {t("recommendation", "Recommendation")}
          </h2>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
          <FiCpu className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-5 flex flex-1 flex-col rounded-xl border border-slate-100 bg-slate-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("insight", "Insight")}
            </p>

            <h3 className="mt-2 break-words text-lg font-bold leading-7 text-slate-900 sm:text-xl">
              {recommendation?.title ||
                t(
                  "no_recommendation_yet",
                  "No recommendation yet"
                )}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {recommendation?.recommendation_type ||
              t("idle", "Idle")}
          </span>
        </div>

        <div className="mt-4 flex-1">
          <p className="break-words text-sm leading-7 text-slate-600">
            {recommendation?.message ||
              t(
                "generate_ai_recommendation_hint",
                "Click the button below to generate an AI recommendation based on today's activity."
              )}
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={loading}
          className={`mt-6 flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ${
            loading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
          }`}
        >
          <FiZap className="h-5 w-5" />

          {loading
            ? t("generating", "Generating...")
            : t(
                "generate_recommendation",
                "Generate Recommendation"
              )}
        </button>
      </div>
    </section>
  );
}