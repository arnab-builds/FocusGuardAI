import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  Settings,
  UserCircle2,
  Languages,
  Menu,
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

function Navbar({ onToggleSidebar }) {
  const {
    currentLanguageCode,
    languages,
    setLanguageById,
    t,
  } = useLanguage();

  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [languageSaving, setLanguageSaving] =
    useState(false);

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
      const data = await getNotifications();

      const notificationList =
        data.notifications ||
        data.results ||
        (Array.isArray(data) ? data : []);

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
        const data = await getProfile();

        const organizationName =
          getOrganizationName(data) ||
          getStoredOrganizationName();

        const nextUsername =
          data.username ||
          localStorage.getItem("username") ||
          t(
            "organization_admin",
            "Organization Admin"
          );

        setProfile({
          username: nextUsername,
          organization: organizationName,
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
      await markNotificationAsRead(
        notification.id
      );

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLanguageChange = async (
    event
  ) => {
    const languageId = event.target.value;

    if (!languageId || languageSaving) return;

    try {
      await setLanguageById(languageId);
      // Saving the preference is non-critical; never delay the language
      // switch or navigation for it.
      void updatePreferredLanguage(languageId).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLanguageSaving(false);
    }
  };
  return (
  <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 dark:from-slate-900/90 dark:to-slate-800/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      {/* Left Section */}

      <div className="flex items-center gap-4">

        <button
          onClick={() => onToggleSidebar?.()}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
    {t(
      "organization_dashboard",
      "Organization Dashboard"
    )}
  </h1>

  <div className="mt-2 flex items-center gap-2">
    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

    <p className="text-base text-slate-600 dark:text-slate-400">
      {t("welcome_back", "Welcome back,")}{" "}
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {username}
      </span>
    </p>
  </div>
</div>

      </div>

      {/* Right Section */}

      <div className="flex flex-wrap items-center justify-end gap-3">

        {/* Language */}

        <div className="flex h-11 items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 shadow-sm">

          <Languages
            size={18}
            className="mr-2 text-indigo-600 dark:text-indigo-400"
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
            className="bg-transparent text-sm outline-none dark:text-slate-200 [&>option]:dark:bg-slate-800"
          >
            {languages.map((language) => (
              <option
                key={language.id}
                value={language.id}
              >
                {language.native_name ||
                  language.language_name}
              </option>
            ))}
          </select>

        </div>

        {/* Search */}

        <div className="relative hidden xl:block">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
          />

          <input
            type="text"
            placeholder={t(
              "search_employees",
              "Search employees..."
            )}
            className="h-11 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 pl-11 pr-4 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/50"
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
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-700"
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

          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-3 w-[380px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4">

                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
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
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
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
                  <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    {t(
                      "no_notifications_found",
                      "No notifications found."
                    )}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className={`cursor-pointer border-b border-slate-100 dark:border-slate-700/50 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                        !notification.is_read ? "bg-indigo-50 dark:bg-slate-700/80" : "bg-white dark:bg-slate-800"
                      }`}
                    >
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        {notification.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {notification.message || notification.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        {notification.created_at
                          ? new Date(notification.created_at).toLocaleString()
                          : notification.time}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}

        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-700">
          <Settings size={20} />
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 shadow-sm">

          <div className="relative">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>

            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>

          </div>

          <div className="min-w-0">

            <p className="truncate text-base font-semibold text-slate-800 dark:text-slate-200">
              {username}
            </p>

            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {organization}
            </p>

          </div>

        </div>

      </div>

    </div>

  </header>
);

}

export default Navbar;
