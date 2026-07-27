import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import OrganizationsTable from "../../components/organizations/OrganizationsTable";
import CreateOrganizationModal from "../../components/organizations/CreateOrganizationModal";

import { getOrganizations } from "../../services/superAdminService";

function Organizations() {
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrganizations = async () => {
    try {
      setLoading(true);

      const res = await getOrganizations();

      console.log("Organizations API:", res.data);

      setOrganizations(res.data);
    } catch (err) {
      console.error("Error loading organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Organizations
            </h1>

            <p className="text-gray-500 mt-2">
              Manage organizations.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            + Create Organization
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            Loading organizations...
          </div>
        ) : (
          <OrganizationsTable
            organizations={organizations}
            refreshOrganizations={loadOrganizations}
          />
        )}
      </div>

      <CreateOrganizationModal
        open={open}
        onClose={() => {
          setOpen(false);
          loadOrganizations();
        }}
      />
    </AdminLayout>
  );
}

export default Organizations;