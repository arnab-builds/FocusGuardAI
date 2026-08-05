import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { updateOrganization } from "../../services/superAdminService";

function EditOrganizationModal({
    open,
    onClose,
    organization,
}) {
    const { t } = useLanguage();

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
                is_active:
                    organization.status === "Active",
            });
        }
    }, [organization]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

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

            alert(
                t(
                    "failed_to_update_organization",
                    "Failed to update organization."
                )
            );
        }
    };

    if (!open || !organization) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full sm:w-[94%] md:w-[650px] max-w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-slate-100 border border-slate-100 animate-[fadeScale_0.25s_ease-out]">
                <div className="flex justify-between items-center px-6 sm:px-8 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-blue-600" />

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                            {t(
                                "edit_organization",
                                "Edit Organization"
                            )}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="px-6 sm:px-8 py-6 space-y-6"
                >
                    <div>
                        <label className="block font-semibold text-slate-700 text-sm mb-2">
                            {t(
                                "organization_name",
                                "Organization Name"
                            )}
                        </label>

                        <input
                            name="name"
                            value={form.name}
                            onChange={
                                handleChange
                            }
                            placeholder={t(
                                "organization_name",
                                "Organization Name"
                            )}
                            className="w-full h-[52px] px-4 border border-slate-200 rounded-xl shadow-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 hover:border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 text-sm mb-2">
                            {t(
                                "address",
                                "Address"
                            )}
                        </label>

                        <textarea
                            name="address"
                            value={form.address}
                            onChange={
                                handleChange
                            }
                            rows={4}
                            placeholder={t(
                                "address",
                                "Address"
                            )}
                            className="w-full min-h-[120px] px-4 py-3 border border-slate-200 rounded-xl shadow-sm resize-y text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 hover:border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-4">
                        <label
                            htmlFor="is_active"
                            className="font-semibold text-slate-700 text-sm cursor-pointer"
                        >
                            {t(
                                "organization_active",
                                "Organization Active"
                            )}
                        </label>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                id="is_active"
                                type="checkbox"
                                name="is_active"
                                checked={
                                    form.is_active
                                }
                                onChange={
                                    handleChange
                                }
                                className="peer sr-only"
                            />

                            <div className="w-12 h-7 rounded-full bg-slate-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 transition-all duration-300 shadow-inner" />

                            <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto border border-slate-200 text-slate-600 font-medium px-5 py-3 rounded-xl shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                        >
                            {t(
                                "cancel",
                                "Cancel"
                            )}
                        </button>

                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 active:scale-95"
                        >
                            {t(
                                "save_changes",
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
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

export default EditOrganizationModal;