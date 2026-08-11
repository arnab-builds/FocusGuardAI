import { useEffect, useState } from "react";
import {
    Bell,
    Clock3,
    Trash2,
    Check,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../../services/notificationService";

import {
    getApiErrorMessage,
    normalizeListResponse,
} from "../../utils/responseUtils";

function NotificationList() {
    const { t } = useLanguage();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        const timeout = setTimeout(loadNotifications, 0);

        return () => clearTimeout(timeout);
    }, []);

    async function loadNotifications() {
        try {
            const data = await getNotifications();

            setNotifications(
                normalizeListResponse(
                    data,
                    ["notifications", "results", "data"]
                )
            );

            setError("");
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "notifications_load_failed",
                        "Notifications could not be loaded."
                    )
                )
            );
        } finally {
            setLoading(false);
        }
    }

    const handleRead = async (id) => {
        try {
            setActionId(id);

            await markNotificationAsRead(id);

            loadNotifications();
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "notification_mark_read_failed",
                        "Notification could not be marked as read."
                    )
                )
            );
        } finally {
            setActionId(null);
        }
    };

    const handleReadAll = async () => {
        try {
            setActionId("all");

            const unreadNotifications =
                notifications.filter(
                    (notification) =>
                        !notification.is_read
                );

            if (
                unreadNotifications.length > 0
            ) {
                await markAllNotificationsAsRead();
            }

            loadNotifications();
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "notifications_mark_read_failed",
                        "Notifications could not be marked as read."
                    )
                )
            );
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            setActionId(id);

            await deleteNotification(id);

            loadNotifications();
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "notification_delete_failed",
                        "Notification could not be deleted."
                    )
                )
            );
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button
                    onClick={handleReadAll}
                    disabled={
                        actionId === "all" ||
                        notifications.every(
                            (notification) =>
                                notification.is_read
                        )
                    }
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                >
                    <Check size={18} />

                    {actionId === "all"
                        ? t(
                              "updating",
                              "Updating..."
                          )
                        : t(
                              "mark_all_read",
                              "Mark All as Read"
                          )}
                </button>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-5 py-4">
                    <span className="text-xl leading-none mt-0.5">
                        ⚠️
                    </span>

                    <p className="text-sm sm:text-base font-medium text-red-700 dark:text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="space-y-5">
                    {[0, 1, 2, 3].map((skeleton) => (
                        <div
                            key={skeleton}
                            className="rounded-3xl border border-blue-100/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/20 dark:to-slate-800 shadow-sm p-6 animate-pulse"
                        >
                            <div className="flex gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />

                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
                                    <div className="h-3.5 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
                                    <div className="h-3 w-1/4 rounded-full bg-slate-100 dark:bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-5">
                    {notifications.map(
                        (notification) => (
                            <div
                                key={
                                    notification.id
                                }
                                className="rounded-3xl border border-blue-100/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/20 dark:to-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 sm:p-7 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5 animate-[fadeIn_0.3s_ease-out]"
                            >
                                <div className="flex gap-4 min-w-0">
                                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-900/20 flex items-center justify-center shadow-sm">
                                        <Bell
                                            className="text-indigo-600 dark:text-indigo-400"
                                            size={
                                                24
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                {
                                                    notification.title
                                                }
                                            </h2>

                                            {!notification.is_read ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-900/50">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                    {t(
                                                        "unread",
                                                        "Unread"
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    <Check
                                                        size={
                                                            12
                                                        }
                                                    />
                                                    {t(
                                                        "read",
                                                        "Read"
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2.5 text-base leading-7 text-slate-600 dark:text-slate-300">
                                            {notification.message ||
                                                notification.description}
                                        </p>

                                        <div className="flex items-center gap-1.5 mt-3 text-slate-400 dark:text-slate-500 text-sm font-medium">
                                            <Clock3
                                                size={
                                                    15
                                                }
                                            />

                                            {notification.created_at ||
                                                notification.time}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col gap-2.5 self-start">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() =>
                                                handleRead(
                                                    notification.id
                                                )
                                            }
                                            disabled={
                                                actionId ===
                                                notification.id
                                            }
                                            title={t(
                                                "mark_as_read",
                                                "Mark as read"
                                            )}
                                            className="h-11 w-11 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-900/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            <Check
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    )}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                notification.id
                                            )
                                        }
                                        disabled={
                                            actionId ===
                                            notification.id
                                        }
                                        title={t(
                                            "delete_notification",
                                            "Delete notification"
                                        )}
                                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm transition-all duration-200 hover:bg-red-200 dark:hover:bg-red-900/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        <Trash2
                                            size={18}
                                        />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="rounded-3xl border border-blue-100/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/20 dark:to-slate-800 shadow-sm p-14 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Bell
                            className="text-indigo-400"
                            size={30}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t(
                            "no_notifications",
                            "No Notifications"
                        )}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                        {t(
                            "no_notifications_found",
                            "You're all caught up. New notifications will appear here."
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

export default NotificationList;