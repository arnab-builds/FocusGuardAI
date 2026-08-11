import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiUser,
} from "react-icons/fi";

import { loginUser } from "../../services/authService";
import { useLanguage } from "../../context/useLanguage";
import ThemeToggle from "../../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const registrationSuccess = Boolean(
    location.state?.registrationSuccess
  );

  const {
    currentLanguageCode,
    languages,
    setLanguageByCode,
    setLanguageFromPreference,
    t,
  } = useLanguage();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handlePublicLanguageChange = async (
    event
  ) => {
    await setLanguageByCode(
      event.target.value
    );
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      await setLanguageFromPreference(
        data.user?.preferred_language
      );

      const dashboardByRole = {
        SUPER_ADMIN: "/super-admin/dashboard",
        SUB_ADMIN: "/organization-admin/dashboard",
        EMPLOYEE: "/dashboard",
        NORMAL_USER: "/dashboard",
        USER: "/dashboard",
      };

      navigate(dashboardByRole[data.user?.role] || "/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-theme relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-6">

      {/* Background Blur */}

      <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

      {/* Language */}

      <div className="absolute right-6 top-6 z-20 flex items-center gap-3">

        <ThemeToggle />

        <div className="relative">

          <FiGlobe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

          <select
            value={currentLanguageCode}
            onChange={
              handlePublicLanguageChange
            }
            className="rounded-xl border border-white/70 bg-white/95 py-2 pl-10 pr-5 text-sm font-medium text-slate-700 shadow-lg backdrop-blur outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            {languages.map((language) => (
              <option
                key={language.id}
                value={
                  language.language_code
                }
              >
                {language.native_name ||
                  language.language_name}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* Login Card */}

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl md:grid-cols-2">

        {/* Left Side */}

        <div className="hidden flex-col justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-12 text-white md:flex">

          <div className="mb-10 flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">

              <FiLock size={30} />

            </div>

            <div>

              <h1 className="text-5xl font-extrabold tracking-tight">
                FocusGuard
              </h1>

              <p className="mt-2 text-blue-100">
                {t("employee_productivity_platform")}
              </p>

            </div>

          </div>

          <p className="text-lg leading-8 text-blue-100">
            {t(
              "productivity_tagline",
              "Monitor productivity, track activity, analyze reports and improve focus with one powerful dashboard."
            )}
          </p>

          <div className="mt-10 space-y-4">

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

              <h3 className="font-semibold">
                {t(
                  "real_time_activity_tracking",
                  "Real-time Activity Tracking"
                )}
              </h3>

              <p className="mt-1 text-sm text-blue-100">
                {t("login_feature_monitoring")}
              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

              <h3 className="font-semibold">
                {t(
                  "ai_productivity_insights",
                  "AI Productivity Insights"
                )}
              </h3>

              <p className="mt-1 text-sm text-blue-100">
                {t("login_feature_recommendations")}
              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

              <h3 className="font-semibold">
                {t(
                  "daily_analytics_reports",
                  "Daily Analytics & Reports"
                )}
              </h3>

              <p className="mt-1 text-sm text-blue-100">
                {t("login_feature_reports")}
              </p>

            </div>

          </div>

        </div>
                {/* Right Side */}

        <div className="p-10 md:p-14">

          <h2 className="text-4xl font-bold text-slate-800">
            {t("welcome_back", "Welcome Back")}
          </h2>

          <p className="mb-8 mt-2 text-slate-500">
            {t(
              "login_subtitle",
              "Sign in to continue to FocusGuard"
            )}
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 shadow-sm">
              {error}
            </div>
          )}

          {registrationSuccess && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm">
              {t(
                "account_created_login_prompt",
                "Account created successfully. Please login."
              )}
            </div>
          )}

          {/* Username */}

          <div className="relative mb-5">

            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t("username", "Username")}
              className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-4 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

          </div>

          {/* Password */}

          <div className="relative mb-8">

            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("password", "Password")}
              className="w-full rounded-2xl border border-slate-300 py-4 pl-12 pr-12 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleLogin();
                }
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-indigo-600"
            >
              {showPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>

          </div>

          {/* Login */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-semibold text-white shadow-lg transition-all duration-300 ${
              loading
                ? "cursor-not-allowed bg-slate-400"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>

                {t("signing_in", "Signing In...")}
              </>
            ) : (
              t("login", "Login")
            )}
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            {t(
              "secure_authentication",
              "Secure authentication powered by JWT"
            )}
          </p>

          <p className="mt-3 text-center text-sm text-slate-500">
            {t(
              "new_to_focusguard",
              "New to FocusGuard?"
            )}{" "}
            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              {t("create_user", "Create User")}
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            FocusGuard v1.0 • Employee Productivity Platform
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
