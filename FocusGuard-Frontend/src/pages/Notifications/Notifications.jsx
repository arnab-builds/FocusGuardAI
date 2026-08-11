import { useCallback, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";
import { useLanguage } from "../../context/useLanguage";

function Notifications() {
  const { currentLanguageCode, t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedLanguageCode, setLoadedLanguageCode] = useState(null);

  const fetchNotifications = useCallback(async (signal) => {
    try {
      const data = await getNotifications(currentLanguageCode, signal);

      setNotifications(
        Array.isArray(data) ? data : data.results || []
      );
      setLoadedLanguageCode(currentLanguageCode);
    } catch (error) {
      if (error.name === "CanceledError") {
        return;
      }

      console.error("Notification Error:", error);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [currentLanguageCode]);

  useEffect(() => {
    const controller = new AbortController();

    const requestTimer = window.setTimeout(() => {
      fetchNotifications(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
      controller.abort();
    };
  }, [fetchNotifications]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("delete_notification_confirmation", "Delete this notification?")
    );

    if (!confirmed) return;

    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || loadedLanguageCode !== currentLanguageCode) {
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
