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
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    goal_metric: "Deep Work Session",
    target_value: "",
    priority: "Medium",
    deadline: "",
    notes: "",
  });
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(Array.isArray(data) ? data : data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
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
        <h1 className="text-3xl font-bold text-slate-800">
          {t("focus_goals", "Focus Goals")}
        </h1>
        <p className="mt-2 text-slate-500">
          {t(
            "create_productivity_goals_ai_strategy",
            "Create productivity goals and let AI build a personalized execution strategy."
          )}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            {t("add_new_goal", "Add New Goal")}
          </h2>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("goal_metric", "Goal Metric")}
              </label>
              <select name="goal_metric" value={form.goal_metric} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-3">
                {metricValues.map(([value, key, fallback]) => (
                  <option key={value} value={value}>{t(key, fallback)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("target_value", "Target Value")}
              </label>
              <input type="number" name="target_value" value={form.target_value} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("priority", "Priority")}
              </label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-3">
                {["Low", "Medium", "High"].map((priority) => (
                  <option key={priority} value={priority}>{priorityLabel(priority)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("deadline", "Deadline")}
              </label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t("notes", "Notes")}
              </label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} className="w-full resize-y rounded-lg border border-slate-300 p-3" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
              {t("save_goal", "Save Goal")}
            </button>
          </form>
        </section>

        <section className="min-w-0 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-800">
              {t("your_goals", "Your Goals")}
            </h2>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              {goals.length} {t("goals", "Goals")}
            </span>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-xl border bg-white p-10 text-center">{t("loading", "Loading...")}</div>
            ) : goals.length === 0 ? (
              <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
                {t("no_focus_goals_created", "No focus goals created.")}
              </div>
            ) : goals.map((goal) => (
              <article key={goal.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <h3 className="break-words text-xl font-semibold text-slate-800">{goal.goal_metric}</h3>
                    <p className="mt-1 text-sm text-slate-500">{t("target", "Target")}: {goal.target_value}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{goal.status === "Completed" ? t("completed", "Completed") : goal.status === "On Track" ? t("on_track", "On Track") : goal.status}</span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">{priorityLabel(goal.priority)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm text-slate-600"><span>{t("progress", "Progress")}</span><span>{goal.progress ?? 0}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, Number(goal.progress) || 0))}%` }} /></div>
                </div>
                {goal.notes && <p className="mt-4 break-words text-sm text-slate-600">{goal.notes}</p>}
                {goal.plan && <div className="mt-4 rounded-xl bg-emerald-50 p-4"><p className="font-semibold text-emerald-700">🧠 {t("ai_plan_ready", "AI Plan Ready")}</p><p className="mt-1 text-sm text-slate-600">{t("personalized_execution_plan_generated_successfully", "Personalized execution plan generated successfully.")}</p></div>}
                <div className="mt-5 flex flex-wrap gap-3">
                  {!goal.plan ? <button onClick={() => createPlan(goal.id)} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">{t("generate_plan", "Generate Plan")}</button> : <><button onClick={() => viewPlan(goal.id)} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">{t("view_plan", "View Plan")}</button><button onClick={() => regeneratePlan(goal.id)} className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{t("regenerate", "Regenerate")}</button></>}
                  <button onClick={() => removeGoal(goal.id)} className="rounded-lg border border-red-200 px-4 py-2 font-medium text-red-600 hover:bg-red-50">{t("delete", "Delete")}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {showPlanModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-slate-800">🧠 {t("ai_focus_plan", "AI Focus Plan")}</h2><button onClick={() => setShowPlanModal(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">{t("close", "Close")}</button></div><div className="prose max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPlan?.plan || selectedPlan?.content || ""}</ReactMarkdown></div></div></div>}
    </div>
  );
}
