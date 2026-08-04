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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-700">
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
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {t(
              "reminder_settings",
              "Reminder Settings"
            )}
          </h1>

          <p className="mt-2 text-slate-500">
            {t(
              "configure_reminders",
              "Configure productivity reminders and notification preferences."
            )}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Productive */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="mb-5 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                <FiCheckCircle size={24} />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {t(
                    "productive_threshold_minutes",
                    "Productive Threshold"
                  )}
                </h2>

                <p className="text-sm text-slate-500">
                  Minutes before productivity reminders.
                </p>

              </div>

            </div>

            <input
              type="number"
              name="productive_threshold"
              value={settings.productive_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

          </div>

          {/* Non Productive */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="mb-5 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">

                <FiActivity size={24} />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {t(
                    "non_productive_threshold_minutes",
                    "Non-Productive Threshold"
                  )}
                </h2>

                <p className="text-sm text-slate-500">
                  Minutes before distraction reminders.
                </p>

              </div>

            </div>

            <input
              type="number"
              name="non_productive_threshold"
              value={settings.non_productive_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>
                    {/* Idle Threshold */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="mb-5 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

                <FiClock size={24} />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {t(
                    "idle_threshold_minutes",
                    "Idle Threshold"
                  )}
                </h2>

                <p className="text-sm text-slate-500">
                  Minutes before idle reminders.
                </p>

              </div>

            </div>

            <input
              type="number"
              name="idle_threshold"
              value={settings.idle_threshold}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />

          </div>

          {/* Browser Notifications */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between gap-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                  <FiBell size={24} />

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    {t(
                      "browser_notifications",
                      "Browser Notifications"
                    )}
                  </h2>

                  <p className="text-sm text-slate-500">
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

                <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>

              </label>

            </div>

          </div>

          {/* Save Button */}

          <div className="sticky bottom-0 rounded-2xl bg-slate-100/80 py-2 backdrop-blur-sm">

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
              className={`rounded-2xl border p-4 text-center font-medium transition-all ${
                message.includes("❌")
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
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