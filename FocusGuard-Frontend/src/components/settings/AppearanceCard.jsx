import {
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function AppearanceCard() {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">

          <FiMoon size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            {t("appearance", "Appearance")}
          </h2>

          <p className="text-sm text-slate-500">
            {t(
              "customize_application_appearance",
              "Customize the application appearance."
            )}
          </p>

        </div>

      </div>

      {/* Card */}

      <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

            <FiSun size={20} />

          </div>

          <div>

            <p className="font-semibold text-slate-900">
              {t("dark_mode", "Dark Mode")}
            </p>

            <p className="text-sm text-slate-500">
              {t(
                "coming_soon",
                "Coming Soon"
              )}
            </p>

          </div>

        </div>

        <button
          disabled
          className="rounded-xl bg-slate-300 px-6 py-3 font-semibold text-slate-600 opacity-70 cursor-not-allowed"
        >
          {t("disabled", "Disabled")}
        </button>

      </div>

    </section>
  );
}