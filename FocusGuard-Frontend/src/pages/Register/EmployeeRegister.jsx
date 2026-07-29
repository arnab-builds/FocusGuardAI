import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGlobe,
  FiKey,
  FiLock,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";

import { registerEmployee } from "../../services/authService";
import { useLanguage } from "../../context/useLanguage";

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
  const {
    currentLanguageCode,
    getLanguageByCode,
    languages,
    setLanguageByCode,
    setLanguageById,
    t,
  } = useLanguage();

  const [form, setForm] = useState({
    invite_code: "",
    username: "",
    password: "",
    confirm_password: "",
    preferred_language: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        currentForm.preferred_language ||
        String(selectedLanguage.id),
    }));
  }, [currentLanguageCode, getLanguageByCode]);

  const handlePublicLanguageChange = async (event) => {
    const languageCode = event.target.value;
    const selectedLanguage = getLanguageFromCode(
      languages,
      languageCode
    );

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
      await registerEmployee({
        invite_code: form.invite_code.trim(),
        username: form.username.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
        preferred_language: form.preferred_language,
      });

      navigate("/", {
        replace: true,
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center p-6">
      <div className="absolute right-5 top-5">
        <div className="relative">
          <FiGlobe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={currentLanguageCode}
            onChange={handlePublicLanguageChange}
            aria-label={t("preferred_language", "Preferred Language")}
            className="rounded-xl border border-white/70 bg-white py-2 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
        className="w-full max-w-[440px] rounded-2xl bg-white p-8 shadow-2xl space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <FiUserPlus size={28} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            {t("employee_registration", "Employee Registration")}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {t(
              "employee_registration_subtitle",
              "Create your FocusGuardAI account"
            )}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("invitation_code", "Invitation Code")}
          </label>

          <div className="relative">
            <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              name="invite_code"
              value={form.invite_code}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("username", "Username")}
          </label>

          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("preferred_language", "Preferred Language")}
          </label>

          <div className="relative">
            <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <select
              name="preferred_language"
              value={form.preferred_language}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("password", "Password")}
          </label>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("confirm_password", "Confirm Password")}
          </label>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? t("creating_account", "Creating Account...")
            : t("create_account", "Create Account")}
        </button>
      </form>
    </div>
  );
}

export default EmployeeRegister;
