import { TriangleAlert } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { deleteOrganization } from "../../services/superAdminService";

function DeleteOrganizationModal({
    open,
    onClose,
    organization,
}) {
    const { t } = useLanguage();

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
                t(
                    "failed_to_delete_organization",
                    "Failed to delete organization."
                )
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-3xl w-[92%] sm:w-full max-w-[520px] shadow-2xl border border-slate-100 p-6 sm:p-8 transition-all duration-300">
                <div className="flex justify-center mb-5 sm:mb-6">
                    <div className="bg-gradient-to-b from-red-50 to-red-100 p-5 sm:p-6 rounded-full shadow-sm shadow-red-200/50">
                        <TriangleAlert
                            className="text-red-600"
                            size={40}
                        />
                    </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900">
                    {t(
                        "delete_organization",
                        "Delete Organization"
                    )}
                </h2>

                <p className="text-center text-slate-500 mt-4 leading-relaxed break-words">
                    {t(
                        "delete_organization_confirmation",
                        "Are you sure you want to delete"
                    )}{" "}
                    <span className="font-semibold text-slate-900">
                        {organization.name}
                    </span>
                    ?
                </p>

                <div className="flex items-center justify-center gap-2 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <TriangleAlert
                        className="text-red-500 shrink-0"
                        size={16}
                    />

                    <p className="text-center text-sm font-medium text-red-600">
                        {t(
                            "action_cannot_be_undone",
                            "This action cannot be undone."
                        )}
                    </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-300"
                    >
                        {t(
                            "cancel",
                            "Cancel"
                        )}
                    </button>

                    <button
                        onClick={handleDelete}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-b from-red-500 to-red-600 text-white text-sm font-semibold shadow-md shadow-red-600/20 transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
                    >
                        {t(
                            "delete",
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteOrganizationModal;