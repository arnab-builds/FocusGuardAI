import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Globe2,
    KeyRound,
    Lock,
    Mail,
    ShieldCheck,
    User,
    UserPlus,
} from "lucide-react";

import {
    getInvitationEmail,
    registerOrganizationAdmin,
} from "../services/authService";
import { useLanguage } from "../context/useLanguage";
import { getApiErrorMessage } from "../utils/responseUtils";
import ThemeToggle from "../../components/ThemeToggle";

function OrganizationRegister() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const invitedEmail = searchParams.get("email")?.trim() || "";
    const {
        currentLanguageCode,
        getLanguageByCode,
        languages,
        setLanguageByCode,
        setLanguageById,
        t,
    } = useLanguage();

    const [form, setForm] = useState({
        invite_code: searchParams.get("invite_code")?.trim() || "",
        email: invitedEmail,
        username: "",
        password: "",
        confirm_password: "",
        preferred_language: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resolvedInvitationEmail, setResolvedInvitationEmail] =
        useState(invitedEmail);

    useEffect(() => {
        if (invitedEmail || !form.invite_code) return;

        let isCurrent = true;

        getInvitationEmail(form.invite_code)
            .then((email) => {
                if (!isCurrent) return;
                setResolvedInvitationEmail(email);
                setForm((currentForm) => ({ ...currentForm, email }));
            })
            .catch(() => {
                // The registration endpoint will show the authoritative invite error on submit.
            });

        return () => { isCurrent = false; };
    }, [invitedEmail, form.invite_code]);

    useEffect(() => {
        const selectedLanguage = getLanguageByCode(currentLanguageCode);

        if (!selectedLanguage) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setForm((currentForm) => ({
                ...currentForm,
                preferred_language:
                    currentForm.preferred_language ||
                    String(selectedLanguage.id),
            }));
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [currentLanguageCode, getLanguageByCode]);

    const handlePublicLanguageChange = async (event) => {
        const languageCode = event.target.value;
        const selectedLanguage = getLanguageByCode(languageCode);

        await setLanguageByCode(languageCode);

        if (selectedLanguage) {
            setForm((currentForm) => ({
                ...currentForm,
                preferred_language: String(selectedLanguage.id),
            }));
        }
    };

    const handleChange = async (event) => {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value,
        });

        if (name === "preferred_language") {
            await setLanguageById(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await registerOrganizationAdmin({
                invite_code: form.invite_code.trim(),
                email: form.email.trim(),
                username: form.username.trim(),
                password: form.password,
                confirm_password: form.confirm_password,
                preferred_language: form.preferred_language,
            });

            navigate("/login", {
                replace: true,
            });
        } catch (submitError) {
            setError(
                getApiErrorMessage(
                    submitError,
                    "Registration failed."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="public-theme relative flex min-h-screen items-center justify-center overflow-y-auto bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-4 py-4 sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute left-4 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-20 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="absolute right-4 top-4 z-20 flex items-center gap-3 sm:right-6 sm:top-6">
                <ThemeToggle />
                <div className="relative">
                    <Globe2
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <select
                        value={currentLanguageCode}
                        onChange={handlePublicLanguageChange}
                        aria-label={t(
                            "preferred_language",
                            "Preferred Language"
                        )}
                        className="rounded-2xl border border-white/40 bg-white/90 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-xl shadow-slate-950/10 outline-none backdrop-blur-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    >
                        {languages.map((language) => (
                            <option
                                key={language.id}
                                value={language.language_code}
                            >
                                {language.native_name || language.language_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative mt-14 w-full max-w-[620px] rounded-[2rem] border border-white/40 bg-white/90 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:mt-0 sm:p-6"
            >
                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 shadow-sm">
                        <ShieldCheck size={24} />
                    </div>

                    <div className="mb-2 inline-flex items-center rounded-3xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t("invitation", "Invitation")}
                    </div>

                    <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                        {t(
                            "organization_admin_registration",
                            "Organization Admin Registration"
                        )}
                    </h1>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                        {t(
                            "organization_admin_registration_subtitle",
                            "Create your administrator account"
                        )}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
                        {error}
                    </div>
                )}

                <div className="mt-5 space-y-3">
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        {t("invitation_code", "Invitation Code")}
                    </label>

                    <div className="relative">
                        <KeyRound
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            name="invite_code"
                            value={form.invite_code}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        {t("username", "Username")}
                    </label>

                    <div className="relative">
                        <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        {t("email", "Email")}
                    </label>

                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            readOnly={Boolean(resolvedInvitationEmail)}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 read-only:bg-slate-50 read-only:text-slate-600"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        {t(
                            "preferred_language",
                            "Preferred Language"
                        )}
                    </label>

                    <div className="relative">
                        <Globe2
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            name="preferred_language"
                            value={form.preferred_language}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
                                    {language.native_name || language.language_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        {t("password", "Password")}
                    </label>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        {t(
                            "confirm_password",
                            "Confirm Password"
                        )}
                    </label>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="password"
                            name="confirm_password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>
                </div>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? (
                        t("creating_account", "Creating Account...")
                    ) : (
                        <span className="inline-flex items-center justify-center gap-2">
                            <UserPlus size={18} />
                            {t("create_account", "Create Account")}
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
}

export default OrganizationRegister;
