
import PageHeader from "../components/common/PageHeader";
import SettingsForm from "../components/settings/SettingsForm";

import { useLanguage } from "../context/useLanguage";
import { useOrgTheme } from "../context/OrgThemeContext";
import { Moon, Sun } from "lucide-react";

function SettingsContent() {
    const { t } = useLanguage();
    const { theme, toggleTheme } = useOrgTheme();

    return (
        <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <PageHeader
                        title={t(
                            "settings",
                            "Settings"
                        )}
                        subtitle={t(
                            "manage_organization_settings",
                            "Manage organization settings"
                        )}
                    />

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto"
                    >
                        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                        {theme === "dark" ? t("light_mode", "Light mode") : t("dark_mode", "Dark mode")}
                    </button>
                </div>

                <SettingsForm />
        </div>
    );
}

function Settings() {
    return (
            <SettingsContent />
    );
}

export default Settings;
