import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import SettingsForm from "../../components/settings/SettingsForm";

import { useLanguage } from "../../context/useLanguage";

function Settings() {
    const { t } = useLanguage();
    const [theme, setTheme] = useState(() =>
        localStorage.getItem("focusguard_superadmin_theme") === "dark"
            ? "dark"
            : "light"
    );

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        localStorage.setItem("focusguard_superadmin_theme", nextTheme);
        if (nextTheme === "dark") {
            document.documentElement.dataset.superadminTheme = "dark";
            document.documentElement.style.backgroundColor = "#0B1120";
        } else {
            delete document.documentElement.dataset.superadminTheme;
            document.documentElement.style.backgroundColor = "";
        }
        setTheme(nextTheme);
        window.dispatchEvent(new CustomEvent("superadmin-theme-change", { detail: nextTheme }));
    };

    return (
            <div className="space-y-3 sm:space-y-4">
                <div className="relative flex min-h-10 items-center justify-start pr-12 sm:pr-32">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {t("settings", "Settings")}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            {t("configure_platform_settings", "Configure platform settings.")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:px-4 sm:py-2.5"
                        aria-label={theme === "dark" ? t("light_mode", "Light mode") : t("dark_mode", "Dark mode")}
                    >
                        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                        <span className="hidden sm:inline">
                            {theme === "dark" ? t("light_mode", "Light mode") : t("dark_mode", "Dark mode")}
                        </span>
                    </button>
                </div>

                <SettingsForm />
            </div>
    );
}

export default Settings;
