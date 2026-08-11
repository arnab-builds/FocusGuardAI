import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiClock,
  FiGlobe,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
  FiUserPlus,
  FiZap,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { registerEmployee, registerNormalUser } from "../../services/authService";
import { useLanguage } from "../../context/useLanguage";
import ThemeToggle from "../../components/ThemeToggle";

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) {
    return "Registration failed.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.error || data.message || data.detail) {
    return data.error || data.message || data.detail;
  }

  const firstKey = Object.keys(data)[0];
  const firstValue = data[firstKey];

  if (Array.isArray(firstValue)) {
    return firstValue.join(" ");
  }

  return firstValue ? String(firstValue) : "Registration failed.";
};

function EmployeeRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("invite_code")?.trim() || "";
  const invitedEmail = searchParams.get("email")?.trim() || "";
  const isInvitationRegistration = Boolean(inviteCode || invitedEmail);
  const {
    currentLanguageCode,
    getLanguageByCode,
    languages,
    setLanguageByCode,
    setLanguageById,
    t,
  } = useLanguage();

  const [form, setForm] = useState({
    username: "",
    email: invitedEmail,
    password: "",
    confirm_password: "",
    preferred_language: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getLanguageFromCode = (languageData, languageCode) =>
    languageData.find(
      (language) => language.language_code === languageCode
    );

  useEffect(() => {
    const selectedLanguage = getLanguageByCode(currentLanguageCode);

    if (!selectedLanguage) {
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      preferred_language:
        currentForm.preferred_language || String(selectedLanguage.id),
    }));
  }, [currentLanguageCode, getLanguageByCode]);

  const handlePublicLanguageChange = async (event) => {
    const languageCode = event.target.value;
    const selectedLanguage = getLanguageFromCode(languages, languageCode);

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
      if (isInvitationRegistration) {
        if (!inviteCode || !invitedEmail) {
          setError(t("invitation_link_incomplete", "This invitation link is incomplete."));
          return;
        }
        await registerEmployee({
          invite_code: inviteCode,
          email: invitedEmail,
          username: form.username.trim(),
          password: form.password,
          confirm_password: form.confirm_password,
          preferred_language: form.preferred_language,
        });
      } else {
        await registerNormalUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          confirm_password: form.confirm_password,
          preferred_language: form.preferred_language,
        });
      }

      navigate("/login", {
        replace: true,
        state: isInvitationRegistration
          ? undefined
          : { registrationSuccess: true },
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-theme relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-4 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative w-full max-w-[600px] rounded-[2rem] border border-white/40 bg-white/90 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-3xl bg-indigo-50 px-4 py-2 text-indigo-700 shadow-sm">
              <FiUserPlus className="mr-2 h-5 w-5" />
              {t("register_now", "Register now")}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {isInvitationRegistration
                ? t("employee_registration", "Employee Registration")
                : t("normal_user_registration", "Create Your Account")}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
              {t(
                isInvitationRegistration
                  ? "employee_registration_subtitle"
                  : "normal_user_registration_subtitle",
                "Create your FocusGuardAI account"
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="border-slate-200 bg-slate-50 shadow-sm hover:bg-slate-100" />
            <div className="relative inline-flex min-w-[180px] items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <FiGlobe className="mr-2 h-4 w-4 text-indigo-600" />
              <select
                value={currentLanguageCode}
                onChange={handlePublicLanguageChange}
                aria-label={t("preferred_language", "Preferred Language")}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.language_code}>
                    {language.native_name || language.language_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              {t("username", "Username")}
            </label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              {t("email", "Email")}
            </label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                readOnly={isInvitationRegistration}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              {t("preferred_language", "Preferred Language")}
            </label>
            <div className="relative">
              <FiGlobe className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                name="preferred_language"
                value={form.preferred_language}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              >
                <option value="" disabled>
                  {t("select_language", "Select language")}
                </option>
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.native_name || language.language_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                {t("password", "Password")}
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-14 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  aria-label={showPassword ? t("hide_password", "Hide Password") : t("show_password", "Show Password")}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                {t("confirm_password", "Confirm Password")}
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-14 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  aria-label={showConfirmPassword ? t("hide_password", "Hide Password") : t("show_password", "Show Password")}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-white" />
            )}
            {loading
              ? t("creating_account", "Creating Account...")
              : t("create_account", "Create Account")}
          </button>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              {t("already_have_account_login", "Already have an account? Login")}
            </button>
            <p className="text-xs text-slate-400">
              {t("footer_tagline", "FocusGuard v1.0 • Employee Productivity Platform")}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeRegister;
