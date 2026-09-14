import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "../../context/useLanguage";

import {
  getGoals,
  createGoal,
  deleteGoal,
  generateFocusPlan,
  regenerateFocusPlan,
  getFocusPlan,
} from "../../services/focusGoalService";
import { fetchWithCache, getCache, setCache } from "../../utils/apiCache";

const metricValues = [
  ["Deep Work Session", "deep_work_session", "Deep Work Session"],
  ["Social Media Limit", "social_media_limit", "Social Media Limit"],
  ["Daily Focus Score Target", "daily_focus_score_target", "Daily Focus Score Target"],
  ["Daily Screen Time Limit", "daily_screen_time_limit", "Daily Screen Time Limit"],
  ["Context Switch Limit", "context_switch_limit", "Context Switch Limit"],
  ["Break Frequency Target", "break_frequency_target", "Break Frequency Target"],
  ["No-Distraction Block", "no_distraction_block", "No-Distraction Block"],
];

export default function FocusGoals() {
  const { t } = useLanguage();
  const cacheKey = "emp-focus-goals";
  const [goals, setGoals] = useState(() => getCache(cacheKey) || []);
  const [loading, setLoading] = useState(() => !getCache(cacheKey));
  const [form, setForm] = useState({
    goal_metric: "Deep Work Session",
    target_value: "",
    priority: "Medium",
    deadline: "",
    notes: "",
  });
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const loadGoals = async (showLoading = true) => {
    try {
      if (showLoading && !getCache(cacheKey)) setLoading(true);
      const data = await fetchWithCache(cacheKey, getGoals);
      const processed = Array.isArray(data) ? data : data.results || [];
      setGoals(processed);
      setCache(cacheKey, processed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadGoals(true);
    return () => { isMounted = false; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleCreateGoal = async (event) => {
    event.preventDefault();
    await createGoal(form);
    setForm((currentForm) => ({
      ...currentForm,
      target_value: "",
      deadline: "",
      notes: "",
    }));
    await loadGoals();
  };

  const removeGoal = async (id) => {
    if (!window.confirm(t("delete_goal_confirmation", "Delete this goal?"))) {
      return;
    }

    await deleteGoal(id);
    await loadGoals();
  };

  const createPlan = async (id) => {
    try {
      await generateFocusPlan(id);
      await loadGoals();
    } catch {
      alert(t("unable_to_generate_plan", "Unable to generate plan."));
    }
  };

  const regeneratePlan = async (id) => {
    try {
      await regenerateFocusPlan(id);
      await loadGoals();
    } catch {
      alert(t("unable_to_regenerate_plan", "Unable to regenerate plan."));
    }
  };

  const viewPlan = async (id) => {
    try {
      const plan = await getFocusPlan(id);
      setSelectedPlan(plan);
      setShowPlanModal(true);
    } catch (error) {
      console.error("Focus plan error:", error);
    }
  };

  const priorityLabel = (priority) =>
    t(priority.toLowerCase(), priority);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-50">
          {t("focus_goals", "Focus Goals")}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t(
            "create_productivity_goals_ai_strategy",
            "Create productivity goals and let AI build a personalized execution strategy."
          )}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[2px] lg:sticky lg:top-24 lg:p-6">
          <h2 className="mb-6 text-xl font-semibold text-indigo-700 dark:text-indigo-400">
            {t("add_new_goal", "Add New Goal")}
          </h2>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("goal_metric", "Goal Metric")}
              </label>
              <select
                name="goal_metric"
                value={form.goal_metric}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              >
                {metricValues.map(([value, key, fallback]) => (
                  <option key={value} value={value}>{t(key, fallback)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("target_value", "Target Value")}
              </label>
              <input
                type="number"
                name="target_value"
                value={form.target_value}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("priority", "Priority")}
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              >
                {["Low", "Medium", "High"].map((priority) => (
                  <option key={priority} value={priority}>{priorityLabel(priority)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("deadline", "Deadline")}
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("notes", "Notes")}
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              {t("save_goal", "Save Goal")}
            </button>
          </form>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-50">
              {t("your_goals", "Your Goals")}
            </h2>
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              {goals.length} {t("goals", "Goals")}
            </span>
          </div>

          <div className="space-y-4">
            {loading && goals.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 animate-pulse items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                  <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{t("loading", "Loading...")}</div>
              </div>
            ) : goals.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-10 text-center text-slate-500 dark:text-slate-400">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">🎯</div>
                <div className="text-lg font-medium">{t("no_focus_goals_created", "No focus goals created.")}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("create_first_goal_to_get_started", "Create your first goal to get started.")}</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {goals.map((goal) => {
                  const progress = Math.min(100, Math.max(0, Number(goal.progress) || 0));
                  
                  let statusGradient = "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] border-indigo-100/50 dark:border-slate-700/50 border-t-[3px] border-t-indigo-500";
                  if (goal.status === "Completed") statusGradient = "bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-[#111827] border-emerald-100/50 dark:border-slate-700/50 border-t-[3px] border-t-emerald-500";
                  else if (goal.status === "At Risk" || goal.status === "Pending") statusGradient = "bg-gradient-to-br from-amber-50/70 to-white dark:from-amber-950/30 dark:to-[#111827] border-amber-100/50 dark:border-slate-700/50 border-t-[3px] border-t-amber-500";
                  else if (goal.status === "Failed" || goal.status === "Overdue") statusGradient = "bg-gradient-to-br from-rose-50/70 to-white dark:from-rose-950/30 dark:to-[#111827] border-rose-100/50 dark:border-slate-700/50 border-t-[3px] border-t-rose-500";
                  else statusGradient = "bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] border-indigo-100/50 dark:border-slate-700/50 border-t-[3px] border-t-indigo-500";

                  return (
                    <article key={goal.id} className={`rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[2px] ${statusGradient}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 break-words">{goal.goal_metric}</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("target", "Target")}: <span className="font-medium text-slate-800 dark:text-slate-200">{goal.target_value}</span></p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end text-right">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${goal.status === "Completed" ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"}`}>
                              {goal.status === "Completed" ? t("completed", "Completed") : goal.status === "On Track" ? t("on_track", "On Track") : goal.status}
                            </span>
                            <span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-400">{priorityLabel(goal.priority)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                          <span>{t("progress", "Progress")}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{progress}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      {goal.notes && <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 break-words">{goal.notes}</p>}

                      {goal.plan && (
                        <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4">
                          <p className="font-semibold text-emerald-700 dark:text-emerald-400">🧠 {t("ai_plan_ready", "AI Plan Ready")}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("personalized_execution_plan_generated_successfully", "Personalized execution plan generated successfully.")}</p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        {!goal.plan ? (
                          <button onClick={() => createPlan(goal.id)} className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                            {t("generate_plan", "Generate Plan")}
                          </button>
                        ) : (
                          <>
                            <button onClick={() => viewPlan(goal.id)} className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                              {t("view_plan", "View Plan")}
                            </button>
                            <button onClick={() => regeneratePlan(goal.id)} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                              {t("regenerate", "Regenerate")}
                            </button>
                          </>
                        )}

                        <button onClick={() => removeGoal(goal.id)} className="rounded-xl border border-red-200 dark:border-red-900/50 px-4 py-2 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                          {t("delete", "Delete")}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-50">🧠 {t("ai_focus_plan", "AI Focus Plan")}</h2>
              <button onClick={() => setShowPlanModal(false)} className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">{t("close", "Close")}</button>
            </div>
            <div className="prose dark:prose-invert max-w-none p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPlan?.plan || selectedPlan?.content || ""}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
