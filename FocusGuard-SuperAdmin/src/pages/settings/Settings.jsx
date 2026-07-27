import AdminLayout from "../../components/layout/AdminLayout";
import SettingsForm from "../../components/settings/SettingsForm";

function Settings() {
  return (
    <AdminLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Configure platform settings.
          </p>

        </div>

        <SettingsForm />

      </div>

    </AdminLayout>
  );
}

export default Settings;