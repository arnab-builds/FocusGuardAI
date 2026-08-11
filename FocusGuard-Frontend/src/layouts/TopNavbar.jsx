import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiGlobe,
} from "react-icons/fi";
import { getNotifications } from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import { updatePreferredLanguage } from "../services/settingsService";

const getGreetingKey = (now = new Date()) => {
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return ["good_morning", "Good Morning"];
  }

  if (hour >= 12 && hour < 17) {
    return ["good_afternoon", "Good Afternoon"];
  }

  if (hour >= 17 && hour < 21) {
    return ["good_evening", "Good Evening"];
  }

  return ["good_night", "Good Night"];
};

const parseDurationToSeconds = (time) => {
  if (!time) return 0;

  const cleanTime = time.split(".")[0];
  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  return (
    (hours || 0) * 3600 +
    (minutes || 0) * 60 +
    (seconds || 0)
  );
};

const formatSelectedDate = (date, locale) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getProductivityScore = (analytics) => {
  if (!analytics) return null;

  const productiveSeconds = parseDurationToSeconds(
    analytics.productive_time
  );

  const nonProductiveSeconds = parseDurationToSeconds(
    analytics.non_productive_time
  );

  const idleSeconds = parseDurationToSeconds(
    analytics.idle_time
  );

  const totalSeconds =
    productiveSeconds +
    nonProductiveSeconds +
    idleSeconds;

  return totalSeconds > 0
    ? Math.round((productiveSeconds / totalSeconds) * 100)
    : 0;
};

export default function TopNavbar({
  profile,
  analytics,
  selectedDate,
  onDateChange,
  onToggleSidebar,
}) {
  const { currentLanguageCode, languages, setLanguageById, t } = useLanguage();
  const [languageSaving, setLanguageSaving] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const navigate = useNavigate();

  const username = profile?.username || "";
  const [greetingKey, greetingFallback] = getGreetingKey(currentTime);
  const greeting = t(greetingKey, greetingFallback);
  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const productivityScore =
    getProductivityScore(analytics);

  const handleLanguageChange = async (event) => {
    const languageId = event.target.value;
    if (!languageId || languageSaving) return;

    try {
      await setLanguageById(languageId);
      // Persist in the background; the local i18next resources have already
      // updated the screen and must not wait for a network round-trip.
      void updatePreferredLanguage(languageId).catch((error) => {
        console.error("Preferred language could not be updated:", error);
      });
    } catch (error) {
      console.error("Preferred language could not be updated:", error);
    } finally {
      setLanguageSaving(false);
    }
  };

  useEffect(() => {
    const updateGreeting = () => setCurrentTime(new Date());
    const interval = setInterval(updateGreeting, 60_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications(currentLanguageCode);
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadNotifications();
  }, [currentLanguageCode]);

  return (
    <header className="border-b border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50/80 dark:bg-none dark:bg-[#0B1120] px-4 py-4 sm:px-8 sm:py-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleSidebar?.()}
              className="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden"
              aria-label={t("open_menu")}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-50">
                {greeting}
              </p>
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {formatSelectedDate(
              selectedDate,
              currentLanguageCode || undefined
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label className="relative flex h-12 min-w-[190px] items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm transition hover:shadow-md focus-within:border-indigo-500 dark:focus-within:border-indigo-400">
            <span className="sr-only">
              {t("preferred_language", "Preferred Language")}
            </span>
            <select
              value={
                languages.find(
                  (language) =>
                    language.language_code === currentLanguageCode
                )?.id ?? ""
              }
              onChange={handleLanguageChange}
              disabled={languageSaving || !languages.length}
              className="min-w-0 w-full bg-transparent text-sm font-medium outline-none disabled:cursor-wait text-slate-900 dark:text-slate-100"
              aria-label={t("preferred_language", "Preferred Language")}
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id} className="dark:bg-slate-800 dark:text-slate-100">
                  {language.native_name || language.language_name}
                </option>
              ))}
            </select>
          </label>

          <input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 shadow-sm outline-none transition hover:shadow-md focus:border-indigo-500 dark:focus:border-indigo-400 sm:w-auto"
          />

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-emerald-800/20 px-6 py-3 shadow-sm">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {t("productivity_score", "Productivity Score")}
            </p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {productivityScore === null
                ? "--"
                : `${numberFormatter.format(productivityScore)}%`}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label={t("notifications", "Notifications")}
            >
              <FiBell size={22} />
              {notifications.some((n) => !n.is_read) && (
                 <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-800 bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[min(100vw-1rem,420px)] max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl">
                <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {t("notifications", "Notifications")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {notifications.length} {t("new", "new")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto px-2 py-2">
                  {notifications.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className={`group flex gap-3 rounded-2xl px-4 py-4 transition ${
                        item.is_read
                          ? "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          : "bg-slate-50 dark:bg-slate-700/50 ring-1 ring-indigo-100 dark:ring-indigo-900"
                      }`}
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm">
                        {item.notification_type === "PRODUCTIVE_SESSION" && (
                          <FiCheckCircle className="h-5 w-5 text-emerald-500" />
                        )}
                        {item.notification_type === "NON_PRODUCTIVE" && (
                          <FiAlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                        {![
                          "PRODUCTIVE_SESSION",
                          "NON_PRODUCTIVE",
                        ].includes(item.notification_type) && (
                          <FiClock className="h-5 w-5 text-indigo-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {item.message}
                        </p>
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                          {new Date(item.created_at).toLocaleString(
                            currentLanguageCode || undefined
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/notifications");
                  }}
                  className="sticky bottom-0 w-full border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {t("view_all_notifications", "View All Notifications")}
                </button>
              </div>
            )}
          </div>

          <div className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-sm transition hover:shadow-md sm:w-auto">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/10">
              <span className="text-base font-semibold">
                {username.charAt(0).toUpperCase() || "?"}
              </span>
              <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-500" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">
                {username}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {profile?.role === "NORMAL_USER"
                  ? t("user", "User")
                  : t("employee", "Employee")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
