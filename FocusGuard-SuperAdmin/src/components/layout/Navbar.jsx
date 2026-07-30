import { useEffect, useRef, useState } from "react";
import {
    Search,
    Bell,
    Settings,
    UserCircle2,
    Languages,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    getAdminNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    updatePreferredLanguage,
} from "../../services/superAdminService";

const getGreeting = (t) => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return t("good_morning", "Good Morning");
    }

    if (hour >= 12 && hour < 17) {
        return t("good_afternoon", "Good Afternoon");
    }

    if (hour >= 17 && hour < 21) {
        return t("good_evening", "Good Evening");
    }

    return t("good_night", "Good Night");
};

function Navbar() {
    const { currentLanguageCode, languages, setLanguageById, t } = useLanguage();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] =
        useState(false);
    const [languageSaving, setLanguageSaving] = useState(false);

    const notificationRef = useRef(null);

    const loadNotifications = async () => {
        try {
            const { data } =
                await getAdminNotifications();

            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleNotificationClick = async (
        notification
    ) => {
        if (notification.is_read) return;

        try {
            await markNotificationRead(notification.id);
            await loadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            await loadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLanguageChange = async (event) => {
        const languageId = event.target.value;
        if (!languageId || languageSaving) return;

        try {
            setLanguageSaving(true);
            await updatePreferredLanguage(languageId);
            await setLanguageById(languageId);
        } catch (error) {
            console.error("Preferred language could not be updated:", error);
        } finally {
            setLanguageSaving(false);
        }
    };

    return (
        <header className="bg-white h-20 px-8 flex items-center justify-between border-b">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    {getGreeting(t)},{" "}
                    {t(
                        "super_admin",
                        "Super Admin"
                    )}{" "}
                    👋
                </h2>

                <p className="text-slate-500 mt-1">
                    {t(
                        "manage_organizations_monitor_platform",
                        "Manage organizations and monitor your platform."
                    )}
                </p>
            </div>

            <div className="flex items-center gap-5">
                <label className="flex h-12 items-center rounded-xl border border-gray-200 bg-slate-50 px-3 text-slate-600 transition focus-within:border-blue-500 focus-within:bg-white">
                    <Languages size={18} className="mr-2 text-blue-600" aria-hidden="true" />
                    <span className="sr-only">{t("preferred_language", "Preferred Language")}</span>
                    <select
                        value={languages.find((language) => language.language_code === currentLanguageCode)?.id ?? ""}
                        onChange={handleLanguageChange}
                        disabled={languageSaving || !languages.length}
                        className="max-w-28 bg-transparent text-sm font-medium outline-none disabled:cursor-wait"
                        aria-label={t("preferred_language", "Preferred Language")}
                    >
                        {languages.map((language) => (
                            <option key={language.id} value={language.id}>
                                {language.native_name || language.language_name}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-3.5 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder={t(
                            "search",
                            "Search..."
                        )}
                        className="pl-11 pr-5 h-12 w-80 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div
                    className="relative"
                    ref={notificationRef}
                >
                    <button
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                        className="relative w-12 h-12 rounded-xl border flex items-center justify-center hover:bg-slate-100"
                    >
                        <Bell size={20} />

                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-96 rounded-2xl border bg-white shadow-xl z-50">
                            <div className="flex items-center justify-between border-b p-4">
                                <h3 className="font-semibold text-lg">
                                    {t(
                                        "notifications",
                                        "Notifications"
                                    )}
                                </h3>

                                {unreadCount > 0 && (
                                    <button
                                        onClick={
                                            handleMarkAllRead
                                        }
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {t(
                                            "mark_all_read",
                                            "Mark all read"
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500">
                                        {t(
                                            "no_notifications_found",
                                            "No notifications found."
                                        )}
                                    </div>
                                ) : (
                                    notifications.map(
                                        (notification) => (
                                            <div
                                                key={
                                                    notification.id
                                                }
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                                className={`cursor-pointer border-b p-4 transition hover:bg-slate-50 ${
                                                    !notification.is_read
                                                        ? "bg-blue-50"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">
                                                            {notification.title}
                                                        </h4>

                                                        <p className="mt-1 text-sm text-slate-600">
                                                            {notification.message}
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-400">
                                                            {new Date(
                                                                notification.created_at
                                                            ).toLocaleString(
                                                                currentLanguageCode,
                                                                {
                                                                    dateStyle:
                                                                        "medium",
                                                                    timeStyle:
                                                                        "short",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>

                                                    {!notification.is_read && (
                                                        <span className="mt-2 h-2 w-2 rounded-full bg-blue-600"></span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            <div className="border-t p-3">
                                <button className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 transition hover:bg-slate-100">
                                    {t(
                                        "view_all_notifications",
                                        "View All Notifications"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button className="flex h-12 w-12 items-center justify-center rounded-xl border hover:bg-slate-100">
                    <Settings size={20} />
                </button>

                <div className="flex items-center gap-3">
                    <UserCircle2
                        size={42}
                        className="text-blue-600"
                    />

                    <div>
                        <h4 className="font-semibold">
                            {t(
                                "super_admin",
                                "Super Admin"
                            )}
                        </h4>

                        <p className="text-sm text-slate-500">
                            {t(
                                "administrator",
                                "Administrator"
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
