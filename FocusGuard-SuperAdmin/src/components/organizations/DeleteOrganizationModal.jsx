import { TriangleAlert } from "lucide-react";

import { deleteOrganization } from "../../services/superAdminService";

function DeleteOrganizationModal({
  open,
  onClose,
  organization,
}) {

  if (!open || !organization) return null;

  const handleDelete = async () => {

    try {

      await deleteOrganization(
        organization.id
      );

      onClose();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete organization."
      );

    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[500px] shadow-xl p-8">

        <div className="flex justify-center mb-5">

          <div className="bg-red-100 p-5 rounded-full">

            <TriangleAlert
              className="text-red-600"
              size={40}
            />

          </div>

        </div>

        <h2 className="text-2xl font-bold text-center">
          Delete Organization
        </h2>

        <p className="text-center text-gray-500 mt-4">

          Are you sure you want to delete

          <span className="font-semibold text-black">
            {" "}
            {organization.name}
          </span>

          ?

        </p>

        <p className="text-center text-red-500 mt-2">
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={onClose}
            className="border px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  );
}

export default DeleteOrganizationModal;