import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import ProfileCard from "../../components/settings/ProfileCard";
import ExtensionCard from "../../components/settings/ExtensionCard";
import AboutCard from "../../components/settings/AboutCard";
import DeactivationCard from "../../components/settings/DeactivationCard";

import { getProfile } from "../../services/profileService";
import { useLanguage } from "../../context/useLanguage";
import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-900/50">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-10 py-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            {t("loading_settings", "Loading Settings...")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {t("settings", "Settings")}
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {t(
                "manage_account_preferences",
                "Manage your account and application preferences."
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto"
            aria-label={t("toggle_dark_mode", "Toggle dark mode")}
          >
            {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
            {theme === "dark" ? t("light_mode", "Light mode") : t("dark_mode", "Dark mode")}
          </button>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <ProfileCard profile={profile} />

          <ExtensionCard />

          <AboutCard />

          <DeactivationCard />

        </div>

      </div>
    </div>
  );
}
