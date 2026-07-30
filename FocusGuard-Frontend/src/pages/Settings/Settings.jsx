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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold">
          {t("loading_settings", "Loading Settings...")}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("settings", "Settings")}
        </h1>

        <p className="mt-2 text-gray-500">
          {t(
            "manage_account_preferences",
            "Manage your account and application preferences."
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileCard profile={profile} />

        <AppearanceCard />

        <ExtensionCard />

        <AboutCard />

        <DeactivationCard />
      </div>
    </div>
  );
}
