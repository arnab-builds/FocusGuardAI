import { useEffect, useState } from "react";

import ProfileCard from "../../components/settings/ProfileCard";
import AppearanceCard from "../../components/settings/AppearanceCard";
import ExtensionCard from "../../components/settings/ExtensionCard";
import AboutCard from "../../components/settings/AboutCard";
import DeactivationCard from "../../components/settings/DeactivationCard";

import { getProfile } from "../../services/profileService";
import { useLanguage } from "../../context/useLanguage";

export default function Settings() {
  const { t } = useLanguage();

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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700">
            {t("loading_settings", "Loading Settings...")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {t("settings", "Settings")}
          </h1>

          <p className="mt-2 text-slate-500">
            {t(
              "manage_account_preferences",
              "Manage your account and application preferences."
            )}
          </p>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <ProfileCard profile={profile} />

          <AppearanceCard />

          <ExtensionCard />

          <AboutCard />

          <DeactivationCard />

        </div>

      </div>
    </div>
  );
}