import {
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";
import { useTheme } from "../../context/ThemeContext";

export default function AppearanceCard() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">

          <FiMoon size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("appearance", "Appearance")}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t(
              "customize_application_appearance",
              "Customize the application appearance."
            )}
          </p>

        </div>

      </div>

      {/* Card */}

      <div className="flex flex-col gap-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">

            <FiSun size={20} />

          </div>

          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              {t("dark_mode", "Dark Mode")}
            </p>
          </div>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            className="peer sr-only"
          />
          <div className="h-7 w-12 rounded-full bg-slate-300 dark:bg-slate-700 transition peer-checked:bg-indigo-600 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
        </label>
      </div>

    </section>
  );
}