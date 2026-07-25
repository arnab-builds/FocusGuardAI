import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  getGoals,
  createGoal,
  deleteGoal,
  generateFocusPlan,
  regenerateFocusPlan,
  getFocusPlan,
} from "../../services/focusGoalService";

const metrics = [
  "Deep Work Session",
  "Social Media Limit",
  "Daily Focus Score Target",
  "Daily Screen Time Limit",
  "Context Switch Limit",
  "Break Frequency Target",
  "No-Distraction Block",
];

const priorities = ["Low", "Medium", "High"];

export default function FocusGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const [form, setForm] = useState({
    goal_metric: "Deep Work Session",
    target_value: "",
    priority: "Medium",
    deadline: "",
    notes: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createGoal(form);

    setForm({
      goal_metric: "Deep Work Session",
      target_value: "",
      priority: "Medium",
      deadline: "",
      notes: "",
    });

    loadGoals();
  };

  const removeGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    await deleteGoal(id);
    loadGoals();
  };

  const createPlan = async (id) => {
    try {
      await generateFocusPlan(id);
      loadGoals();
    } catch {
      alert("Unable to generate plan.");
    }
  };

  const regeneratePlan = async (id) => {
    try {
      await regenerateFocusPlan(id);
      loadGoals();
    } catch {
      alert("Unable to regenerate plan.");
    }
  };

 const viewPlan = async (id) => {
  try {
    const data = await getFocusPlan(id);

    setSelectedPlan(data.plan);
    setShowPlanModal(true);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <>
      <div className="p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Focus Goals
          </h1>

          <p className="mt-2 text-slate-500">
            Create productivity goals and let AI build a personalized execution
            strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">
              Add New Goal
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Goal Metric
                </label>

                <select
                  name="goal_metric"
                  value={form.goal_metric}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  {metrics.map((metric) => (
                    <option key={metric}>
                      {metric}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Target Value
                </label>

                <input
                  type="number"
                  name="target_value"
                  value={form.target_value}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  {priorities.map((priority) => (
                    <option key={priority}>
                      {priority}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Notes
                </label>

                <textarea
                  rows={4}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />

              </div>

              <button
                className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Save Goal
              </button>

            </form>

          </div>

          <div className="lg:col-span-2">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Your Goals
              </h2>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
                {goals.length} Goals
              </span>

            </div>

            {loading ? (
              <div className="rounded-xl border bg-white p-10 text-center">
                Loading...
              </div>
            ) : goals.length === 0 ? (
              <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
                No focus goals created.
              </div>
            ) : (
              <div className="space-y-5">
                                {goals.map((goal) => (

                  <div
                    key={goal.id}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-xl font-semibold">
                          {goal.goal_metric}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Target: {goal.target_value}
                        </p>

                        {goal.notes && (
                          <p className="mt-3 text-slate-600">
                            {goal.notes}
                          </p>
                        )}

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium
                          ${
                            goal.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : goal.status === "On Track"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {goal.status}
                      </span>

                    </div>

                    <div className="mt-5">

                      <div className="mb-2 flex justify-between text-sm">

                        <span>Progress</span>

                        <span>{goal.progress}%</span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                        <div
                          style={{
                            width: `${goal.progress}%`,
                          }}
                          className="h-full rounded-full bg-indigo-600"
                        />

                      </div>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">

                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {goal.priority}
                      </span>

                      {goal.deadline && (
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          📅 {goal.deadline}
                        </span>
                      )}

                    </div>

                    {goal.plan && (
                      <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

                        <p className="font-semibold text-green-700">
                          🧠 AI Plan Ready
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Personalized execution plan generated successfully.
                        </p>

                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {!goal.plan && (
                        <button
                          onClick={() => createPlan(goal.id)}
                          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                        >
                          Generate Plan
                        </button>
                      )}

                      {goal.plan && (
                        <>
                          <button
                            onClick={() => viewPlan(goal.id)}
                            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                          >
                            View Plan
                          </button>

                          <button
                            onClick={() => regeneratePlan(goal.id)}
                            className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600"
                          >
                            Regenerate
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

      {showPlanModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="max-h-[90vh] w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <h2 className="text-2xl font-bold text-slate-800">
                🧠 AI Focus Plan
              </h2>

              <button
                onClick={() => setShowPlanModal(false)}
                className="text-3xl font-bold text-slate-500 hover:text-red-500"
              >
                ×
              </button>

            </div>

            <div className="max-h-[70vh] overflow-y-auto px-8 py-6">

              <article className="prose prose-slate max-w-none prose-headings:text-indigo-700 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl">

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {selectedPlan}
              </ReactMarkdown>

              </article>

            </div>

            <div className="flex justify-end border-t px-6 py-4">

              <button
                onClick={() => setShowPlanModal(false)}
                className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}