import AdminLayout from "../../components/layout/AdminLayout";
import SettingsForm from "../../components/settings/SettingsForm";

import { useLanguage } from "../../context/useLanguage";

function Settings() {
    const { t } = useLanguage();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t(
                            "settings",
                            "Settings"
                        )}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {t(
                            "configure_platform_settings",
                            "Configure platform settings."
                        )}
                    </p>
                </div>

                <SettingsForm />
            </div>
        </AdminLayout>
    );
}

export default Settings;