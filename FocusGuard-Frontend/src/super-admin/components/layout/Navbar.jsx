import { useEffect, useRef, useState } from "react";
import {
    Search,
    Bell,
    Settings,
    UserCircle2,
    Languages,
    Menu,
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

function Navbar({ onToggleSidebar }) {
    const {
        currentLanguageCode,
        languages,
        setLanguageById,
        t,
    } = useLanguage();

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [languageSaving, setLanguageSaving] =
        useState(false);

    const notificationRef = useRef(null);

    const loadNotifications = async () => {
        try {
            const { data } =
                await getAdminNotifications();

            setNotifications(
                data?.notifications || []
            );

            setUnreadCount(
                data?.unread_count || 0
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(
            loadNotifications,
            30000
        );

        return () => clearInterval(interval);
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

    const handleNotificationClick =
        async (notification) => {
            if (notification.is_read) return;

            try {
                await markNotificationRead(
                    notification.id
                );

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

    const handleLanguageChange =
        async (event) => {
            const languageId =
                event.target.value;

            if (
                !languageId ||
                languageSaving
            )
                return;

            try {
                setLanguageSaving(true);

                await updatePreferredLanguage(
                    languageId
                );

                await setLanguageById(
                    languageId
                );

                window.location.reload();
            } catch (error) {
                console.error(error);
            } finally {
                setLanguageSaving(false);
            }
        };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6 md:px-8 lg:px-10 xl:px-12">

    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Section */}

        <div className="flex items-start gap-4">

            <button
                onClick={() => onToggleSidebar?.()}
                className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100 md:hidden"
            >
                <Menu size={22} />
            </button>

            <div>

                <div>

    <h1 className="text-3xl font-bold tracking-tight text-slate-900">

        {t(
            "platform_dashboard",
            "Platform Dashboard"
        )}

    </h1>

    <div className="mt-2 flex items-center gap-2">

        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

        <p className="text-sm font-medium text-slate-600">

            {t(
                "welcome_super_admin",
                "Welcome back, Super Admin"
            )}

        </p>

    </div>

</div>

            </div>

        </div>

        {/* Right Section */}

        <div className="flex flex-wrap items-center justify-end gap-3">

            {/* Language */}

            <label className="flex h-12 min-w-[180px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm transition focus-within:border-blue-500 focus-within:bg-white">

                <Languages
                    size={18}
                    className="mr-2 shrink-0 text-blue-600"
                />

                <select
                    value={
                        languages.find(
                            (language) =>
                                language.language_code ===
                                currentLanguageCode
                        )?.id ?? ""
                    }
                    onChange={handleLanguageChange}
                    disabled={
                        languageSaving ||
                        !languages.length
                    }
                    className="w-full bg-transparent text-sm font-medium outline-none"
                >
                    {languages.map(
                        (language) => (
                            <option
                                key={language.id}
                                value={
                                    language.id
                                }
                            >
                                {language.native_name ||
                                    language.language_name}
                            </option>
                        )
                    )}
                </select>

            </label>

            {/* Search */}

            <div className="relative w-full sm:w-80">

                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    placeholder={t(
                        "search",
                        "Search..."
                    )}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

            </div>

            {/* Notification */}

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
                    className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100"
                >

                    <Bell size={20} />

                    {unreadCount > 0 && (

                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">

                            {unreadCount > 99
                                ? "99+"
                                : unreadCount}

                        </span>

                    )}

                </button>
                                {/* Notifications Dropdown */}

                {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                            <h3 className="text-base font-bold text-slate-800">
                                {t(
                                    "notifications",
                                    "Notifications"
                                )}
                            </h3>

                            {notifications.some(
                                (notification) =>
                                    !notification.is_read
                            ) && (
                                <button
                                    onClick={
                                        handleMarkAllRead
                                    }
                                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                                >
                                    {t(
                                        "mark_all_read",
                                        "Mark All Read"
                                    )}
                                </button>
                            )}

                        </div>

                        <div className="max-h-[380px] overflow-y-auto">

                            {notifications.length === 0 ? (

                                <div className="px-6 py-10 text-center text-sm text-slate-500">

                                    {t(
                                        "no_notifications",
                                        "No notifications available."
                                    )}

                                </div>

                            ) : (

                                notifications.map(
                                    (notification) => (
                                        <button
                                            key={
                                                notification.id
                                            }
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                            className={`block w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${
                                                notification.is_read
                                                    ? ""
                                                    : "bg-blue-50"
                                            }`}
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div>

                                                    <h4 className="font-semibold text-slate-800">

                                                        {notification.title}

                                                    </h4>

                                                    <p className="mt-1 text-sm leading-6 text-slate-600">

                                                        {notification.message}

                                                    </p>

                                                </div>

                                                {!notification.is_read && (

                                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />

                                                )}

                                            </div>

                                        </button>
                                    )
                                )

                            )}

                        </div>

                    </div>
                )}

            </div>

            {/* Settings */}

            <button
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100"
            >

                <Settings size={20} />

            </button>

            {/* Profile */}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white">

                    <UserCircle2 size={26} />

                </div>

                <div className="hidden sm:block">

                    <p className="font-semibold text-slate-800">

                        {t(
                            "super_admin",
                            "Super Admin"
                        )}

                    </p>

                    <p className="text-xs text-slate-600">

                        admin@focusguard.ai

                    </p>

                </div>

            </div>

        </div>

    </div>

</header>

    );
}

export default Navbar;