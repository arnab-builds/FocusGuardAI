import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import { getNotifications } from "../services/notificationService";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

const getGreetingKey = () => {
  const hour = new Date().getHours();

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
}) {
  const { currentLanguageCode, t } = useLanguage();
  const username = profile?.username || "";

  const [greetingKey, greetingFallback] = getGreetingKey();
  const greeting = t(greetingKey, greetingFallback);
  const numberFormatter = new Intl.NumberFormat(
    currentLanguageCode || undefined
  );

  const productivityScore =
    getProductivityScore(analytics);

  const [showNotifications, setShowNotifications] =
    useState(false);
const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
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
        <header className="border-b border-slate-200 bg-white px-8 py-5">
      <div className="flex items-center justify-between">

        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {greeting}
          </h1>

          {username && (
            <p className="mt-1 text-base font-medium text-slate-700">
              {username}
            </p>
          )}

          <p className="mt-2 text-sm text-slate-500">
            {formatSelectedDate(
              selectedDate,
              currentLanguageCode || undefined
            )}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
          />

          {/* Productivity Score */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2">
            <p className="text-xs font-medium text-emerald-700">
              {t("productivity_score", "Productivity Score")}
            </p>

            <p className="text-xl font-bold text-emerald-700">
              {productivityScore === null
                ? "--"
                : `${numberFormatter.format(productivityScore)}%`}
            </p>
          </div>

          {/* Notifications */}
          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative rounded-xl p-2 transition hover:bg-slate-100"
            >
              <FiBell size={22} />

              {notifications.some((n) => !n.is_read) && (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                <div className="border-b border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900">
                    {t("notifications", "Notifications")}
                  </h3>
                </div>

                <div>

                  {notifications.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 border-b border-slate-100 p-4 hover:bg-slate-50"
                    >

                      <div className="mt-1">

                        {item.notification_type === "PRODUCTIVE_SESSION" && (
                          <FiCheckCircle className="text-green-500" />
                        )}

                        {item.notification_type === "NON_PRODUCTIVE" && (
                          <FiAlertCircle className="text-yellow-500" />
                        )}

                        {![
  "PRODUCTIVE_SESSION",
  "NON_PRODUCTIVE",
].includes(item.notification_type) && (
                          <FiClock className="text-indigo-500" />
                        )}

                      </div>

                      <div className="flex-1">

                        <p className="font-medium text-slate-800">
  {item.title}
</p>

<p className="mt-1 text-sm text-slate-600">
  {item.message}
</p>

<p className="mt-2 text-xs text-slate-500">
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
  className="w-full border-t border-slate-200 p-3 text-sm font-medium text-indigo-600 transition hover:bg-slate-50"
>
  {t("view_all_notifications", "View All Notifications")}
</button>

              </div>
            )}

          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-5">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              {username.charAt(0).toUpperCase() || "?"}
            </div>

            <div>

              <p className="font-semibold text-slate-800">
                {username}
              </p>

              <p className="text-xs text-slate-500">
                {t("employee", "Employee")}
              </p>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
}
