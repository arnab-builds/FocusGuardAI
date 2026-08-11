import { useEffect, useState } from "react";
import {
  FiBell,
  FiClock,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";

import {
  getUserSettings,
  updateUserSettings,
} from "../../services/settingsService";

import { useLanguage } from "../../context/useLanguage";

const Reminders = () => {
  const { t } = useLanguage();

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
      [name]:
        type === "checkbox"
          ? checked
          : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserSettings(settings);

      setMessage(
        t(
          "reminder_settings_updated",
          "✅ Reminder settings updated successfully."
        )
      );

      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage(
        t(
          "failed_to_update_reminder_settings",
          "❌ Failed to update reminder settings."
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center bg-slate-100 dark:bg-slate-900/50">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-10 py-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            {t(
              "loading_reminder_settings",
              "Loading Reminder Settings..."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-5">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {t(
              "reminder_settings",
              "Reminder Settings"
            )}
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t(
              "configure_reminders",
              "Configure productivity reminders and notification preferences."
            )}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-3"
        >

          {/* Productive */}

          <div className="rounded-2xl border border-emerald-100/50 dark:border-slate-700/50 bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-[#111827] p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

            <div className="mb-4 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10">

                <FiCheckCircle size={24} />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {t(
                    "productive_threshold_minutes",
                    "Productive Threshold"
                  )}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Minutes before productivity reminders.
                </p>

              </div>

            </div>

            <input
              type="number"
              name="productive_threshold"
              value={settings.productive_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-3 text-slate-900 dark:text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
            />

          </div>

          {/* Non Productive */}

          <div className="rounded-2xl border border-rose-100/50 dark:border-slate-700/50 bg-gradient-to-br from-rose-50/70 to-white dark:from-rose-950/30 dark:to-[#111827] p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

            <div className="mb-4 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100/50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shadow-sm shadow-rose-500/10">

                <FiActivity size={24} />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {t(
                    "non_productive_threshold_minutes",
                    "Non-Productive Threshold"
                  )}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Minutes before distraction reminders.
                </p>

              </div>

            </div>

            <input
              type="number"
              name="non_productive_threshold"
              value={settings.non_productive_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-3 text-slate-900 dark:text-slate-200 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
            />

          </div>
          {/* Idle Threshold */}

          <div className="rounded-2xl border border-amber-100/50 dark:border-slate-700/50 bg-gradient-to-br from-amber-50/70 to-white dark:from-amber-950/30 dark:to-[#111827] p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

            <div className="mb-4 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100/50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-500/10">

                <FiClock size={24} />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {t(
                    "idle_threshold_minutes",
                    "Idle Threshold"
                  )}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Minutes before idle reminders.
                </p>

              </div>

            </div>

            <input
              type="number"
              name="idle_threshold"
              value={settings.idle_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-3 text-slate-900 dark:text-slate-200 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800"
            />

          </div>

          {/* Browser Notifications */}

          <div className="rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] p-5 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md lg:col-span-3">

            <div className="flex items-center justify-between gap-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">

                  <FiBell size={24} />

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {t(
                      "browser_notifications",
                      "Browser Notifications"
                    )}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t(
                      "receive_reminder_popups",
                      "Receive reminder popups while browsing."
                    )}
                  </p>

                </div>

              </div>

              <label className="relative inline-flex cursor-pointer items-center">

                <input
                  type="checkbox"
                  name="browser_notifications"
                  checked={settings.browser_notifications}
                  onChange={handleChange}
                  className="peer sr-only"
                />

                <div className="h-7 w-12 rounded-full bg-slate-300 dark:bg-slate-700 transition peer-checked:bg-indigo-600 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>

              </label>

            </div>

          </div>

          {/* Save Button */}

          <div className="lg:col-span-3">

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
            >
              {t(
                "save_reminder_settings",
                "Save Reminder Settings"
              )}
            </button>

          </div>

          {/* Alert */}

          {message && (

            <div
              className={`rounded-2xl border p-4 text-center font-medium transition-all lg:col-span-3 ${
                message.includes("❌")
                  ? "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  : "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {message}
            </div>

          )}

        </form>

      </div>

    </div>

  );
};

export default Reminders;
