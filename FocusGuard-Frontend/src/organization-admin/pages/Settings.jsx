import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import SettingsForm from "../components/settings/SettingsForm";

import { useLanguage } from "../context/useLanguage";

function Settings() {
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <div className="space-y-6">
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

                <SettingsForm />
            </div>
        </DashboardLayout>
    );
}

export default Settings;
