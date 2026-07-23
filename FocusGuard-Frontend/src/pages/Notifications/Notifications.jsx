import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();

      setNotifications(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (error) {
      console.error("Notification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
      "Delete this notification?"
    );

    if (!confirmed) return;

    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        🔔 Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          No notifications available.
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow p-6 mb-5 border-l-4 ${
              notification.is_read
                ? "border-gray-300"
                : "border-blue-600"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  {notification.title}
                </h2>

                <p className="mt-2 text-gray-700">
                  {notification.message}
                </p>

                <div className="mt-4 flex gap-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {notification.notification_type}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notification.is_read && (
                  <button
                    onClick={() =>
                      handleRead(notification.id)
                    }
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(notification.id)
                  }
                  className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
                  title="Delete Notification"
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