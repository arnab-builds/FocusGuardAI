import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { updateOrganization } from "../../services/superAdminService";

function EditOrganizationModal({
  open,
  onClose,
  organization,
}) {

  const [form, setForm] = useState({
    name: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {

    if (organization) {
      setForm({
        name: organization.name || "",
        address: organization.address || "",
        is_active: organization.status === "Active",
      });
    }

  }, [organization]);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateOrganization(
        organization.id,
        form
      );

      onClose();

    } catch (err) {

      console.error(err);

      alert("Failed to update organization.");

    }

  };

  if (!open || !organization) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[650px] shadow-xl">

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-2xl font-bold">
            Edit Organization
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div>

            <label className="font-medium">
              Organization Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="font-medium">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={4}
              className="w-full mt-2 border rounded-xl p-3"
            />

          </div>

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            <label>
              Organization Active
            </label>

          </div>

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default EditOrganizationModal;