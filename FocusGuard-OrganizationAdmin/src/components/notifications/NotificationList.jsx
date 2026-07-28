import { useEffect, useState } from "react";
import {
    Bell,
    Clock3,
    Trash2,
    Check,
} from "lucide-react";

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

        }

        catch (error) {

            console.error(error);
            setError(
                getApiErrorMessage(
                    error,
                    "Notifications could not be loaded."
                )
            );

        }

        finally {

            setLoading(false);

        }

    }

    const handleRead = async (id) => {

        try {

            setActionId(id);

            await markNotificationAsRead(id);

            loadNotifications();

        }

        catch (error) {

            console.error(error);
            setError(
                getApiErrorMessage(
                    error,
                    "Notification could not be marked as read."
                )
            );

        }

        finally {

            setActionId(null);

        }

    };

    const handleReadAll = async () => {

        try {

            setActionId("all");

            const unreadNotifications = notifications.filter(
                (notification) => !notification.is_read
            );

            if (unreadNotifications.length > 0) {
                await markAllNotificationsAsRead();
            }

            loadNotifications();

        }

        catch (error) {

            console.error(error);
            setError(
                getApiErrorMessage(
                    error,
                    "Notifications could not be marked as read."
                )
            );

        }

        finally {

            setActionId(null);

        }

    };

    const handleDelete = async (id) => {

        try {

            setActionId(id);

            await deleteNotification(id);

            loadNotifications();

        }

        catch (error) {

            console.error(error);
            setError(
                getApiErrorMessage(
                    error,
                    "Notification could not be deleted."
                )
            );

        }

        finally {

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
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >

                    {actionId === "all"
                        ? "Updating..."
                        : "Mark All Read"}

                </button>

            </div>

            {

                error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )

            }

            {

                loading ? (

                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">

                        Loading notifications...

                    </div>

                ) : notifications.length > 0 ? (

                    notifications.map((notification) => (

                        <div
                            key={notification.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex justify-between items-start hover:shadow-md transition"
                        >

                            <div className="flex gap-4">

                                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                                    <Bell
                                        className="text-indigo-600"
                                        size={22}
                                    />

                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-800">

                                        {notification.title}

                                    </h2>

                                    <p className="mt-2 text-slate-600">

                                        {notification.message || notification.description}

                                    </p>

                                    <div className="flex items-center gap-2 mt-3 text-slate-400 text-sm">

                                        <Clock3 size={15} />

                                        {notification.created_at || notification.time}

                                    </div>

                                </div>

                            </div>

                            <div className="flex gap-2">

                                {

                                    !notification.is_read && (

                                        <button
                                            onClick={() => handleRead(notification.id)}
                                            disabled={actionId === notification.id}
                                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                                        >

                                            <Check size={18} />

                                        </button>

                                    )

                                }

                                <button
                                    onClick={() => handleDelete(notification.id)}
                                    disabled={actionId === notification.id}
                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                >

                                    <Trash2 size={18} />

                                </button>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">

                        No notifications found.

                    </div>

                )

            }

        </div>

    );

}

export default NotificationList;
