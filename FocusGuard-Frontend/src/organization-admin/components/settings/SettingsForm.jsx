import { useEffect, useState } from "react";

import {
    getProfile,
    requestOrganizationDeactivation,
} from "../../services/settingsService";

import { useLanguage } from "../../context/useLanguage";
import { getApiErrorMessage } from "../../utils/responseUtils";

function SettingsForm() {
    const { t } = useLanguage();

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
        <section className="h-full bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
            <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">
                        🏢
                    </span>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {t(
                                "organization_profile",
                                "Organization Profile"
                            )}
                        </h2>

                        <p className="mt-1 text-base text-slate-500">
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
                                <div className="h-3.5 w-28 rounded-full bg-slate-200" />
                                <div className="h-12 w-full rounded-2xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                        <span className="text-xl leading-none mt-0.5">
                            ⚠️
                        </span>

                        <p className="text-sm sm:text-base font-medium text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && (
                    <>
                        <div>
                            <label className="block mb-2.5 font-semibold text-slate-700">
                                {t("email", "Email")}
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400">
                                    📧
                                </span>

                                <input
                                    value={email}
                                    readOnly
                                    className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2.5 font-semibold text-slate-700">
                                {t(
                                    "organization_name",
                                    "Organization Name"
                                )}
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400">
                                    🏢
                                </span>

                                <input
                                    value={organization}
                                    readOnly
                                    className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2.5 font-semibold text-slate-700">
                                {t(
                                    "change_password",
                                    "Change Password"
                                )}
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400">
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
                                    className="w-full h-12 rounded-2xl border border-slate-300 pl-12 pr-4 text-base shadow-sm outline-none transition-all duration-150 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>

        <form
            onSubmit={handleDeactivationSubmit}
            className="h-full bg-white rounded-3xl border border-red-200 shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6"
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">
                        ⚠️
                    </span>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {t(
                                "organization_deactivation_request",
                                "Organization Deactivation"
                            )}
                        </h2>

                        <p className="mt-1 text-base text-slate-500">
                            {t(
                                "submit_request_for_super_admin_review",
                                "Submit a request for Super Admin review."
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <span className="text-xl leading-none mt-0.5">
                        ⚠️
                    </span>

                    <p className="text-sm sm:text-base text-amber-800 leading-6">
                        {t(
                            "deactivation_warning_notice",
                            "This action requires approval from the Super Administrator. Your organization will remain active until the request is reviewed."
                        )}
                    </p>
                </div>

                {deactivationMessage && (
                    <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                        <span className="text-xl leading-none mt-0.5">
                            ✅
                        </span>

                        <p className="text-sm sm:text-base font-medium text-green-700">
                            {deactivationMessage}
                        </p>
                    </div>
                )}

                {deactivationError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                        <span className="text-xl leading-none mt-0.5">
                            ⚠️
                        </span>

                        <p className="text-sm sm:text-base font-medium text-red-700">
                            {deactivationError}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block mb-2.5 font-semibold text-slate-700">
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
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-base leading-6 resize-none shadow-sm outline-none transition-all duration-150 hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        deactivationLoading ||
                        !deactivationReason.trim()
                    }
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 text-white rounded-2xl px-7 py-3 font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
);

}

export default SettingsForm;
