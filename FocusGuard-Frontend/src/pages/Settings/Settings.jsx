import { useEffect, useState } from "react";

import ProfileCard from "../../components/settings/ProfileCard";
import AppearanceCard from "../../components/settings/AppearanceCard";
import ExtensionCard from "../../components/settings/ExtensionCard";
import AboutCard from "../../components/settings/AboutCard";
import DeactivationCard from "../../components/settings/DeactivationCard";

import { getProfile } from "../../services/profileService";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading Settings...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <ProfileCard profile={profile} />

        <AppearanceCard />

        <ExtensionCard />

       

        <AboutCard />

        <DeactivationCard />

      </div>

    </div>
  );
}