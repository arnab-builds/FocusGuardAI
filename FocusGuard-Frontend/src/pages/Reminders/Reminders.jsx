import { useEffect, useState } from "react";
import {
  getUserSettings,
  updateUserSettings,
} from "../../services/settingsService";
import "./Reminders.css";
import { useNavigate } from "react-router-dom";

const Reminders = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    productive_threshold: 60,
    non_productive_threshold: 10,
    idle_threshold: 5,
    browser_notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getUserSettings();
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserSettings(settings);

      setMessage("✅ Reminder settings updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("❌ Failed to update reminder settings.");
    }
  };

  if (loading) {
    return <h2>Loading Reminder Settings...</h2>;
  }

 return (
  <div className="min-h-screen bg-slate-100 p-6">
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl bg-white p-8 shadow-lg">

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-xl bg-slate-800 px-5 py-2 font-medium text-white transition hover:bg-slate-900"
        >
          ← Back to Dashboard
        </button>

        <h1 className="mb-2 text-3xl font-bold text-slate-800">
          Reminder Settings
        </h1>

        <p className="mb-8 text-slate-500">
          Configure productivity reminders and notification preferences.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block font-semibold text-slate-700">
               Productive Threshold (minutes)
            </label>

            <input
              type="number"
              name="productive_threshold"
              value={settings.productive_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
               Non-Productive Threshold (minutes)
            </label>

            <input
              type="number"
              name="non_productive_threshold"
              value={settings.non_productive_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
               Idle Threshold (minutes)
            </label>

            <input
              type="number"
              name="idle_threshold"
              value={settings.idle_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
            <div>
              <h3 className="font-semibold text-slate-700">
                 Browser Notifications
              </h3>

              <p className="text-sm text-slate-500">
                Receive reminder popups while browsing.
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="browser_notifications"
                checked={settings.browser_notifications}
                onChange={handleChange}
                className="peer sr-only"
              />

              <div className="peer h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-indigo-600 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-lg font-semibold text-white transition hover:scale-[1.02]"
          >
             Save Reminder Settings
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 rounded-xl p-4 text-center font-medium ${
              message.includes("Failed")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
export default Reminders;