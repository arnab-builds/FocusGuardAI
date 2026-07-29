import { useEffect, useState } from "react";

import {
    getProfile,
    requestOrganizationDeactivation,
    updatePreferredLanguage,
} from "../../services/settingsService";

import { useLanguage } from "../../context/useLanguage";
import { getApiErrorMessage } from "../../utils/responseUtils";

function SettingsForm() {
    const {
        t,
        languages,
        setLanguageById,
        setLanguageFromPreference,
    } = useLanguage();

    const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [deactivationReason, setDeactivationReason] = useState("");
    const [deactivationMessage, setDeactivationMessage] = useState("");
    const [deactivationError, setDeactivationError] = useState("");
    const [deactivationLoading, setDeactivationLoading] = useState(false);

    async function loadProfile() {
        try {
            const data = await getProfile();

            setOrganization(
                data.organization?.name ||
                    data.organization_name ||
                    ""
            );

            setEmail(data.email || "");

            setPreferredLanguage(
                data.preferred_language?.id
                    ? String(data.preferred_language.id)
                    : ""
            );

            setError("");
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "settings_load_failed",
                        "Settings could not be loaded."
                    )
                )
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(loadProfile, 0);

        return () => clearTimeout(timeout);
    }, []);

    const handlePreferredLanguageChange = async (event) => {
        const languageId = event.target.value;

        setPreferredLanguage(languageId);
        await setLanguageById(languageId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data = await updatePreferredLanguage(
                preferredLanguage
            );

            setPreferredLanguage(
                data.preferred_language?.id
                    ? String(data.preferred_language.id)
                    : ""
            );

            await setLanguageFromPreference(
                data.preferred_language
            );

            setMessage(
                data.message ||
                    t(
                        "preferred_language_updated_successfully",
                        "Preferred language updated successfully."
                    )
            );
        } catch (error) {
            console.error(error);

            setError(
                getApiErrorMessage(
                    error,
                    t(
                        "preferred_language_update_failed",
                        "Preferred language could not be updated."
                    )
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivationSubmit = async (e) => {
        e.preventDefault();

        try {
            setDeactivationLoading(true);
            setDeactivationError("");
            setDeactivationMessage("");

            const data =
                await requestOrganizationDeactivation({
                    reason: deactivationReason,
                });

            console.log(
                "Organization deactivation request submitted:",
                data
            );

            setDeactivationReason("");

            setDeactivationMessage(
                data.message ||
                    t(
                        "organization_deactivation_request_submitted_successfully",
                        "Organization deactivation request submitted successfully."
                    )
            );
        } catch (error) {
            console.error(error);

            setDeactivationError(
                getApiErrorMessage(
                    error,
                    t(
                        "organization_deactivation_request_failed",
                        "Organization deactivation request could not be submitted."
                    )
                )
            );
        } finally {
            setDeactivationLoading(false);
        }
    };
    return (
    <div className="max-w-3xl space-y-6">
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        >
            <div className="space-y-6">
                {loading && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {t(
                            "loading_settings",
                            "Loading settings..."
                        )}
                    </div>
                )}

                {message && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block mb-2 font-medium">
                        {t("email", "Email")}
                    </label>

                    <input
                        value={email}
                        readOnly
                        className="w-full border rounded-xl px-4 py-3 bg-slate-50 text-slate-600"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        {t(
                            "preferred_language",
                            "Preferred Language"
                        )}
                    </label>

                    <select
                        value={preferredLanguage}
                        onChange={handlePreferredLanguageChange}
                        required
                        className="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="" disabled>
                            {t(
                                "select_language",
                                "Select language"
                            )}
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

                <div>
                    <label className="block mb-2 font-medium">
                        {t(
                            "organization_name",
                            "Organization Name"
                        )}
                    </label>

                    <input
                        value={organization}
                        readOnly
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        {t(
                            "change_password",
                            "Change Password"
                        )}
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder={t(
                            "new_password",
                            "New Password"
                        )}
                        className="w-full border rounded-xl px-4 py-3"
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !preferredLanguage
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3"
                >
                    {loading
                        ? t(
                              "saving",
                              "Saving..."
                          )
                        : t(
                              "save_changes",
                              "Save Changes"
                          )}
                </button>
            </div>
        </form>
                <form
            onSubmit={handleDeactivationSubmit}
            className="bg-white rounded-2xl border border-red-200 shadow-sm p-8"
        >
            <div className="space-y-5">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        {t(
                            "organization_deactivation_request",
                            "Organization Deactivation Request"
                        )}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {t(
                            "submit_request_for_super_admin_review",
                            "Submit a request for Super Admin review."
                        )}
                    </p>
                </div>

                {deactivationMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {deactivationMessage}
                    </div>
                )}

                {deactivationError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {deactivationError}
                    </div>
                )}

                <div>
                    <label className="block mb-2 font-medium">
                        {t("reason", "Reason")}
                    </label>

                    <textarea
                        value={deactivationReason}
                        onChange={(e) =>
                            setDeactivationReason(e.target.value)
                        }
                        required
                        rows={5}
                        placeholder={t(
                            "organization_deactivation_reason_placeholder",
                            "Explain why this organization should be deactivated."
                        )}
                        className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        deactivationLoading ||
                        !deactivationReason.trim()
                    }
                    className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 text-white rounded-xl px-6 py-3"
                >
                    {deactivationLoading
                        ? t(
                              "submitting",
                              "Submitting..."
                          )
                        : t(
                              "submit_deactivation_request",
                              "Submit Deactivation Request"
                          )}
                </button>
            </div>
        </form>
    </div>
);

}

export default SettingsForm;