import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe2, ShieldCheck, ChevronDown } from "lucide-react";

import { superAdminLogin } from "../services/authService";
import { useLanguage } from "../context/LanguageContext";

function Login() {
    const navigate = useNavigate();
    const {
        currentLanguageCode,
        languages,
        setLanguageByCode,
        setLanguageFromPreference,
        t,
    } = useLanguage();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handlePublicLanguageChange = async (event) => {
        await setLanguageByCode(event.target.value);
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await superAdminLogin(form);

            localStorage.setItem(
                "access",
                res.data.access
            );

            localStorage.setItem(
                "refresh",
                res.data.refresh
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            await setLanguageFromPreference(
                res.data.user?.preferred_language
            );

            navigate("/dashboard");
        } catch (error) {
            const responseData = error.response?.data;
            const isCredentialValidationError =
                error.response?.status === 400 &&
                (responseData?.non_field_errors ||
                    responseData?.username ||
                    responseData?.password);

            alert(
                isCredentialValidationError
                    ? t(
                          "invalid_username_or_password",
                          "Invalid username or password."
                      )
                    : responseData?.error ||
                t("login_failed", "Login failed")
            );
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
            {/* Decorative background accents */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* base wash */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-blue-50/60" />

                {/* aurora blobs */}
                <div className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-blue-300/30 blur-[100px] sm:h-[32rem] sm:w-[32rem]" />
                <div className="absolute -right-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-300/25 blur-[100px] sm:h-[30rem] sm:w-[30rem]" />
                <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-cyan-200/25 blur-[110px] sm:h-[32rem] sm:w-[32rem]" />
                <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-violet-200/20 blur-[90px]" />

                {/* fine dot grid for texture */}
                <div
                    className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(100,116,139,0.28) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* soft vignette to keep focus on the card */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,transparent_40%,rgba(241,245,249,0.6)_100%)]" />
            </div>

            {/* Language selector */}
            <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
                <div className="group relative">
                    <Globe2
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500"
                    />

                    <select
                        value={currentLanguageCode}
                        onChange={handlePublicLanguageChange}
                        aria-label={t(
                            "preferred_language",
                            "Preferred Language"
                        )}
                        className="cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-white/90 py-2.5 pl-9 pr-9 text-sm font-medium text-slate-700 shadow-md shadow-slate-900/5 outline-none backdrop-blur-sm transition-all duration-200 hover:border-slate-300 hover:shadow-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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

                    <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                </div>
            </div>

            {/* Login card */}
            <div className="relative z-10 w-full max-w-[450px] sm:max-w-[440px]">
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-shadow duration-300 sm:p-10">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30">
                            <ShieldCheck size={26} className="text-white" strokeWidth={2.25} />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
                            {t("super_admin_login", "Super Admin Login")}
                        </h1>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            {t(
                                "login_subtitle",
                                "Sign in with your administrator credentials to continue"
                            )}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="username"
                                className="text-xs font-medium uppercase tracking-wide text-slate-500"
                            >
                                {t("username", "Username")}
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                autoComplete="username"
                                placeholder={t("username", "Username")}
                                value={form.username}
                                onChange={handleChange}
                                className="h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="text-xs font-medium uppercase tracking-wide text-slate-500"
                            >
                                {t("password", "Password")}
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder={t("password", "Password")}
                                value={form.password}
                                onChange={handleChange}
                                className="h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            className="group relative mt-2 flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 outline-none transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 hover:brightness-110 focus:ring-4 focus:ring-blue-200 active:scale-[0.98] active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:brightness-100"
                        >
                            <span className="relative z-10">
                                {t("login", "Login")}
                            </span>
                            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} — {t("secure_admin_access", "Secure administrator access")}
                </p>
            </div>
        </div>
    );
}

export default Login;