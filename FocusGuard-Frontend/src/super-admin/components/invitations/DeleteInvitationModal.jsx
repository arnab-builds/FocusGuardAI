import { TriangleAlert } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { deleteInvitation } from "../../services/superAdminService";

function DeleteInvitationModal({
    open,
    onClose,
    invitation,
}) {
    const { t } = useLanguage();

    if (!open || !invitation) return null;

    const handleDelete = async () => {
        try {
            await deleteInvitation(invitation.id);

            onClose();
        } catch (err) {
            console.error(err);
            alert(
                t(
                    "failed_to_delete_invitation",
                    "Failed to delete invitation."
                )
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl w-full sm:w-[92%] md:w-[95%] max-w-[520px] shadow-2xl ring-1 ring-slate-100 border border-slate-100 p-6 sm:p-8 animate-[fadeScale_0.25s_ease-out]">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100/70 ring-1 ring-red-100 shadow-sm">
                        <TriangleAlert
                            className="text-red-500"
                            size={30}
                            strokeWidth={2}
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 text-center mt-5">
                    {t(
                        "delete_invitation",
                        "Delete Invitation"
                    )}
                </h2>

                <p className="text-slate-500 text-center mt-3 leading-relaxed break-words">
                    {t(
                        "delete_invitation_confirmation",
                        "Are you sure you want to delete the invitation sent to"
                    )}{" "}
                    <span className="font-semibold text-slate-700">
                        {invitation.email}
                    </span>
                    ?
                </p>

                <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-center">
                    <p className="text-sm font-medium text-red-600">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto sm:flex-1 h-12 px-5 rounded-xl border border-slate-200 text-slate-600 font-medium shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                    >
                        {t(
                            "cancel",
                            "Cancel"
                        )}
                    </button>

                    <button
                        onClick={handleDelete}
                        className="w-full sm:w-auto sm:flex-1 h-12 px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:from-red-700 hover:to-red-600 active:scale-95"
                    >
                        {t(
                            "delete",
                            "Delete"
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fadeScale {
                    from {
                        opacity: 0;
                        transform: scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

export default DeleteInvitationModal;