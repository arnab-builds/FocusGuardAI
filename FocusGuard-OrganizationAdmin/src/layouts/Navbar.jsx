import { useEffect, useRef, useState } from "react";
import {
    Search,
    Bell,
    Settings,
    UserCircle2,
    Languages,
} from "lucide-react";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../services/notificationService";
import { getProfile } from "../services/dashboardService";
import {
    getOrganizationName,
    getStoredOrganizationName,
} from "../utils/activityUtils";
import { useLanguage } from "../context/useLanguage";
import { updatePreferredLanguage } from "../services/settingsService";

const getGreeting = (t) => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12)
        return t("good_morning", "Good Morning");

    if (hour >= 12 && hour < 17)
        return t("good_afternoon", "Good Afternoon");

    if (hour >= 17 && hour < 21)
        return t("good_evening", "Good Evening");

    return t("good_night", "Good Night");
};

function Navbar() {
    const { currentLanguageCode, languages, setLanguageById, t } = useLanguage();

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [showNotifications, setShowNotifications] =
        useState(false);
    const [languageSaving, setLanguageSaving] = useState(false);

    const notificationRef = useRef(null);

    const [profile, setProfile] = useState({
        username:
            localStorage.getItem("username") ||
            t(
                "organization_admin",
                "Organization Admin"
            ),
        organization: getStoredOrganizationName(),
    });

    const username = profile.username;

    const organization = profile.organization;

    const loadNotifications = async () => {
        try {
            const data =
                await getNotifications();

            const notificationList =
                data.notifications ||
                data.results ||
                (Array.isArray(data)
                    ? data
                    : []);

            setNotifications(notificationList);

            setUnreadCount(
                data.unread_count ??
                    notificationList.filter(
                        (notification) =>
                            !notification.is_read
                    ).length
            );
        } catch (error) {
            console.error(error);

            setNotifications([]);

            setUnreadCount(0);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(
            loadNotifications,
            0
        );

        const interval = setInterval(
            loadNotifications,
            30000
        );

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data =
                    await getProfile();

                const organizationName =
                    getOrganizationName(data) ||
                    getStoredOrganizationName();

                const nextUsername =
                    data.username ||
                    localStorage.getItem(
                        "username"
                    ) ||
                    t(
                        "organization_admin",
                        "Organization Admin"
                    );

                setProfile({
                    username: nextUsername,
                    organization:
                        organizationName,
                });

                localStorage.setItem(
                    "username",
                    nextUsername
                );

                if (data.email) {
                    localStorage.setItem(
                        "email",
                        data.email
                    );
                }

                if (organizationName) {
                    localStorage.setItem(
                        "organization",
                        organizationName
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        const handleClickOutside = (
            event
        ) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(
                    false
                );
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

    const handleNotificationClick =
        async (notification) => {
            if (notification.is_read)
                return;

            try {
                await markNotificationAsRead(
                    notification.id
                );

                loadNotifications();
            } catch (error) {
                console.error(error);
            }
        };

    const handleMarkAllRead =
        async () => {
            try {
                await markAllNotificationsAsRead();

                loadNotifications();
            } catch (error) {
                console.error(error);
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
                    {getGreeting(t)}, {username} 👋
                </h2>

                <p className="text-slate-500 mt-1">
                    {t(
                        "manage_employees_monitor_productivity",
                        "Manage your employees and monitor productivity."
                    )}
                </p>
            </div>

            <div className="flex items-center gap-5">
                <label className="flex h-12 items-center rounded-xl border border-gray-200 bg-slate-50 px-3 text-slate-600 transition focus-within:border-indigo-500 focus-within:bg-white">
                    <Languages size={18} className="mr-2 text-indigo-600" aria-hidden="true" />
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
                            "search_employees",
                            "Search employees..."
                        )}
                        className="pl-11 pr-5 h-12 w-80 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
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
                                        className="text-sm text-indigo-600 hover:underline"
                                    >
                                        {t(
                                            "mark_all_read",
                                            "Mark all read"
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length ===
                                0 ? (
                                    <div className="p-6 text-center text-gray-500">
                                        {t(
                                            "no_notifications_found",
                                            "No notifications found."
                                        )}
                                    </div>
                                ) : (
                                    notifications.map(
                                        (
                                            notification
                                        ) => (
                                            <div
                                                key={
                                                    notification.id
                                                }
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                                className={`cursor-pointer border-b p-4 hover:bg-slate-50 ${
                                                    !notification.is_read
                                                        ? "bg-indigo-50"
                                                        : ""
                                                }`}
                                            >
                                                <h4 className="font-semibold">
                                                    {
                                                        notification.title
                                                    }
                                                </h4>

                                                <p className="mt-1 text-sm text-slate-600">
                                                    {notification.message ||
                                                        notification.description}
                                                </p>

                                                <p className="mt-2 text-xs text-slate-400">
                                                    {notification.created_at
                                                        ? new Date(
                                                              notification.created_at
                                                          ).toLocaleString()
                                                        : notification.time}
                                                </p>
                                            </div>
                                        )
                                    )
                                )}
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
                        className="text-indigo-600"
                    />

                    <div>
                        <h4 className="font-semibold">
                            {username}
                        </h4>

                        <p className="text-sm text-slate-500">
                            {organization}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
