import { useEffect, useState } from "react";

import ProfileCard from "../../components/settings/ProfileCard";
import AppearanceCard from "../../components/settings/AppearanceCard";
import ExtensionCard from "../../components/settings/ExtensionCard";
import AboutCard from "../../components/settings/AboutCard";
import DeactivationCard from "../../components/settings/DeactivationCard";

import { getProfile } from "../../services/profileService";
import { updatePreferredLanguage } from "../../services/settingsService";
import { useLanguage } from "../../context/useLanguage";

export default function Settings() {
  const {
    languages,
    setLanguageById,
    setLanguageFromPreference,
    t,
  } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [languageSaving, setLanguageSaving] = useState(false);
  const [languageMessage, setLanguageMessage] = useState("");
  const [languageError, setLanguageError] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data);
      setPreferredLanguage(
        data.preferred_language?.id
          ? String(data.preferred_language.id)
          : ""
      );
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePreferredLanguageChange = async (event) => {
    const languageId = event.target.value;

    setPreferredLanguage(languageId);
    await setLanguageById(languageId);
  };

  const handleLanguageSubmit = async (event) => {
    event.preventDefault();

    setLanguageSaving(true);
    setLanguageMessage("");
    setLanguageError("");

    try {
      const data = await updatePreferredLanguage(
        preferredLanguage
      );

      setProfile((currentProfile) => ({
        ...currentProfile,
        preferred_language: data.preferred_language,
      }));

      await setLanguageFromPreference(
        data.preferred_language
      );

      setLanguageMessage(
        data.message ||
          t(
            "preferred_language_updated_successfully",
            "Preferred language updated successfully."
          )
      );
    } catch (error) {
      setLanguageError(
        error?.response?.data?.error ||
          t(
            "preferred_language_update_failed",
            "Preferred language could not be updated."
          )
      );
    } finally {
      setLanguageSaving(false);
    }
  };

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

        <form
          onSubmit={handleLanguageSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-semibold">
            {t("preferred_language", "Preferred Language")}
          </h2>

          <div className="space-y-4">
            {languageMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {languageMessage}
              </div>
            )}

            {languageError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {languageError}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("current_language", "Current Language")}
              </label>

              <select
                value={preferredLanguage}
                onChange={handlePreferredLanguageChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              >
                <option value="" disabled>
                  {t("select_language", "Select language")}
                </option>

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

            <button
              type="submit"
              disabled={
                languageSaving || !preferredLanguage
              }
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {languageSaving
                ? t("saving", "Saving...")
                : t("save_language", "Save Language")}
            </button>
          </div>
        </form>

        <AppearanceCard />

        <ExtensionCard />

        <AboutCard />

        <DeactivationCard />
      </div>
    </div>
  );
}
