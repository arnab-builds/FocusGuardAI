import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import SettingsForm from "../components/settings/SettingsForm";

function Settings() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <PageHeader
                    title="Settings"
                    subtitle="Manage organization settings"
                />

                <SettingsForm />

            </div>

        </DashboardLayout>

    );

}

export default Settings;