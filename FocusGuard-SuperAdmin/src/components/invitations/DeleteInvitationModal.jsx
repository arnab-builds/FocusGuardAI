import { deleteInvitation } from "../../services/superAdminService";

function DeleteInvitationModal({
  open,
  onClose,
  invitation,
}) {
  if (!open || !invitation) return null;

  const handleDelete = async () => {
    try {
      await deleteInvitation(invitation.id);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete invitation.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[430px] p-6">

        <h2 className="text-2xl font-bold mb-3">
          Delete Invitation
        </h2>

        <p className="text-gray-600">
          Are you sure you want to delete the invitation sent to
          <span className="font-semibold">
            {" "}
            {invitation.email}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteInvitationModal;