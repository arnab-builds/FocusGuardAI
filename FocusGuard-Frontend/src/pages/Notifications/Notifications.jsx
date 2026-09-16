import { useCallback, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";
import { fetchWithCache, getCache, setCache } from "../../utils/apiCache";
import { useLanguage } from "../../context/useLanguage";

function Notifications() {
  const { currentLanguageCode, t } = useLanguage();
  
  const cacheKey = `emp-notifications-${currentLanguageCode}`;
  
  const [notifications, setNotifications] = useState(() => getCache(cacheKey) || []);
  const [loading, setLoading] = useState(() => !getCache(cacheKey));
  const [loadedLanguageCode, setLoadedLanguageCode] = useState(() => getCache(cacheKey) ? currentLanguageCode : null);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!getCache(cacheKey)) setLoading(true);

      const data = await fetchWithCache(cacheKey, () => getNotifications(currentLanguageCode));

      const processed = Array.isArray(data) ? data : data.results || [];
      setNotifications(processed);
      setLoadedLanguageCode(currentLanguageCode);
    } catch (error) {
      console.error("Notification Error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentLanguageCode, cacheKey]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const onRealtime = ({ detail }) => {
      const notification = detail?.notification;
      if (detail?.event === "NOTIFICATION_CREATED" && notification?.id != null) {
        setNotifications((previous) => {
          const current = Array.isArray(previous) ? previous : [];
          return current.some((item) => item?.id === notification.id) ? current : [notification, ...current];
        });
      } else if (detail?.event === "NOTIFICATION_READ" && notification?.id != null) {
        setNotifications((previous) => (Array.isArray(previous) ? previous : []).map((item) => item?.id === notification.id ? notification : item));
      } else if (detail?.event === "NOTIFICATION_DELETED") {
        setNotifications((previous) => (Array.isArray(previous) ? previous : []).filter((item) => item?.id !== detail.notification_id));
      } else if (detail?.event === "NOTIFICATIONS_READ_ALL") {
        setNotifications((previous) => (Array.isArray(previous) ? previous : []).map((item) => ({ ...item, is_read: true })));
      }
    };
    window.addEventListener("focusguard:realtime", onRealtime);
    return () => window.removeEventListener("focusguard:realtime", onRealtime);
  }, []);

  const handleRead = (id) => {
    const prevNotifications = [...notifications];

    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      );
      setCache(cacheKey, updated);
      return updated;
    });

    markNotificationRead(id).catch((error) => {
      console.error(error);
      setNotifications(prevNotifications);
      setCache(cacheKey, prevNotifications);
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      t("delete_notification_confirmation", "Delete this notification?")
    );

    if (!confirmed) return;

    const prevNotifications = [...notifications];

    setNotifications((prev) => {
      const updated = prev.filter((notification) => notification.id !== id);
      setCache(cacheKey, updated);
      return updated;
    });

    deleteNotification(id).catch((error) => {
      console.error(error);
      setNotifications(prevNotifications);
      setCache(cacheKey, prevNotifications);
    });
  };

  if ((loading && notifications.length === 0) || loadedLanguageCode !== currentLanguageCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        {t("loading", "Loading...")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-10 dark:bg-slate-900">
      <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-slate-100">
        {t("notifications", "Notifications")}
      </h1>

      {notifications.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-slate-700 shadow dark:bg-slate-800 dark:text-slate-300">
          {t(
            "no_notifications_available",
            "No notifications available."
          )}
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-5 rounded-xl border-l-4 bg-white p-6 shadow dark:bg-slate-800 ${
              notification.is_read
                ? "border-gray-300"
                : "border-blue-600"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {notification.title}
                </h2>

                <p className="mt-2 text-gray-700 dark:text-slate-300">
                  {notification.message}
                </p>

                <div className="mt-4 flex gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {notification.notification_type}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {new Date(
                      notification.created_at
                    ).toLocaleString(currentLanguageCode || undefined)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notification.is_read && (
                  <button
                    onClick={() => handleRead(notification.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                  >
                    {t("mark_read", "Mark Read")}
                  </button>
                )}

                <button
                  onClick={() => handleDelete(notification.id)}
                    className="rounded-full p-2 text-red-600 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/50"
                  title={t(
                    "delete_notification",
                    "Delete Notification"
                  )}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;
