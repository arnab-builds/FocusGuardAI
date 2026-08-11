import { useEffect, useState } from "react";

import {
    getProfile,
    requestOrganizationDeactivation,
} from "../../services/settingsService";

import { useLanguage } from "../../context/useLanguage";
import { getApiErrorMessage } from "../../utils/responseUtils";
import { useOrgTheme } from "../../context/OrgThemeContext";
import { Moon, Sun } from "lucide-react";

function SettingsForm() {
    const { t } = useLanguage();
    const { theme, toggleTheme } = useOrgTheme();

    const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
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
    <div className="grid items-start gap-6 xl:grid-cols-2">
        <section className="h-full rounded-3xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-slate-900/50 dark:to-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
            <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">
                        🏢
                    </span>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            {t(
                                "organization_profile",
                                "Organization Profile"
                            )}
                        </h2>

                        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                            {t(
                                "manage_organization_information_description",
                                "Manage your organization information and account settings."
                            )}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="space-y-4">
                        {[0, 1, 2].map((skeleton) => (
                            <div
                                key={skeleton}
                                className="space-y-2 animate-pulse"
                            >
                                <div className="h-3.5 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
                                <div className="h-12 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-5 py-4">
                        <span className="text-xl leading-none mt-0.5">
                            ⚠️
                        </span>

                        <p className="text-sm sm:text-base font-medium text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && (
                    <>
                        <div>
                            <label className="block mb-2.5 font-semibold text-slate-700 dark:text-slate-300">
                                {t("email", "Email")}
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400 dark:text-slate-500">
                                    📧
                                </span>

                                <input
                                    value={email}
                                    readOnly
                                    className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-12 pr-4 text-base text-slate-600 dark:text-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2.5 font-semibold text-slate-700 dark:text-slate-300">
                                {t(
                                    "organization_name",
                                    "Organization Name"
                                )}
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400 dark:text-slate-500">
                                    🏢
                                </span>

                                <input
                                    value={organization}
                                    readOnly
                                    className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-12 pr-4 text-base text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2.5 font-semibold text-slate-700 dark:text-slate-300">
                                {t(
                                    "change_password",
                                    "Change Password"
                                )}
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400 dark:text-slate-500">
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder={t(
                                        "new_password",
                                        "New Password"
                                    )}
                                    className="w-full h-12 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-12 pr-4 text-base text-slate-900 dark:text-slate-100 shadow-sm outline-none transition-all duration-150 hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>

        <div className="space-y-6">
        <section className="rounded-3xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-slate-900/50 dark:to-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">
                    🎨
                </span>
                <div className="w-full">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {t("appearance", "Appearance")}
                    </h2>
                    <p className="mt-1 mb-5 text-base text-slate-500 dark:text-slate-400">
                        {t("customize_organization_theme", "Customize the theme for your organization dashboard.")}
                    </p>
                    
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">
                                    {theme === "dark" ? t("dark_mode", "Dark Mode") : t("light_mode", "Light Mode")}
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                                theme === "dark" ? "bg-indigo-600" : "bg-slate-300"
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <form
            onSubmit={handleDeactivationSubmit}
            className="rounded-3xl border border-red-100/50 dark:border-red-900/30 bg-gradient-to-br from-red-50/70 to-white dark:from-red-950/20 dark:to-slate-800 shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6"
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">
                        ⚠️
                    </span>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            {t(
                                "organization_deactivation_request",
                                "Organization Deactivation"
                            )}
                        </h2>

                        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                            {t(
                                "submit_request_for_super_admin_review",
                                "Submit a request for Super Admin review."
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
                    <span className="text-xl leading-none mt-0.5">
                        ⚠️
                    </span>

                    <p className="text-sm sm:text-base text-amber-800 dark:text-amber-400 leading-6">
                        {t(
                            "deactivation_warning_notice",
                            "This action requires approval from the Super Administrator. Your organization will remain active until the request is reviewed."
                        )}
                    </p>
                </div>

                {deactivationMessage && (
                    <div className="flex items-start gap-3 rounded-2xl border border-green-200 dark:border-emerald-900/50 bg-green-50 dark:bg-emerald-900/20 px-5 py-4">
                        <span className="text-xl leading-none mt-0.5">
                            ✅
                        </span>

                        <p className="text-sm sm:text-base font-medium text-green-700 dark:text-emerald-400">
                            {deactivationMessage}
                        </p>
                    </div>
                )}

                {deactivationError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 dark:border-rose-900/50 bg-red-50 dark:bg-rose-900/20 px-5 py-4">
                        <span className="text-xl leading-none mt-0.5">
                            ⚠️
                        </span>

                        <p className="text-sm sm:text-base font-medium text-red-700 dark:text-rose-400">
                            {deactivationError}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block mb-2.5 font-semibold text-slate-700 dark:text-slate-300">
                        {t("reason", "Reason")}
                    </label>

                    <textarea
                        value={deactivationReason}
                        onChange={(e) =>
                            setDeactivationReason(e.target.value)
                        }
                        required
                        rows={4}
                        placeholder={t(
                            "organization_deactivation_reason_placeholder",
                            "Explain why this organization should be deactivated."
                        )}
                        className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3.5 text-base text-slate-900 dark:text-slate-100 leading-6 resize-none shadow-sm outline-none transition-all duration-150 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-rose-900/30 focus:border-red-400 dark:focus:border-rose-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        deactivationLoading ||
                        !deactivationReason.trim()
                    }
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 text-white rounded-2xl px-7 py-3 font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                >
                    {deactivationLoading && (
                        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    )}

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
    </div>
);

}

export default SettingsForm;
