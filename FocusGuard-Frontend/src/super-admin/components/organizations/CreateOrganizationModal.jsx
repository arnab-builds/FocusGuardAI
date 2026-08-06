import { useState } from "react";
import { X } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { createOrganization } from "../../services/superAdminService";

function CreateOrganizationModal({ open, onClose }) {
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        contact_number: "",
        max_employees: 50,
        admin_email: "",
    });

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createOrganization(formData);

            alert(
                t(
                    "organization_created_successfully",
                    "Organization created successfully."
                )
            );

            setFormData({
                name: "",
                email: "",
                address: "",
                contact_number: "",
                max_employees: 50,
                admin_email: "",
            });

            onClose();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.error ||
                    JSON.stringify(err.response?.data) ||
                    t(
                        "failed_to_create_organization",
                        "Failed to create organization."
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClasses =
        "w-full mt-2 h-[50px] border border-slate-200 rounded-xl px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    const labelClasses = "text-sm font-semibold text-slate-600";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-3xl w-full max-w-[760px] max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300">
                <div className="flex justify-between items-center border-b border-slate-100 px-6 sm:px-7 py-5 sm:py-6 shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {t(
                            "create_organization",
                            "Create Organization"
                        )}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 sm:p-7 space-y-5 overflow-y-auto"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClasses}>
                                {t(
                                    "organization_name",
                                    "Organization Name"
                                )}
                            </label>

                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder={t(
                                    "organization_name_placeholder",
                                    "Google Pvt Ltd"
                                )}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>
                                {t(
                                    "organization_email",
                                    "Organization Email"
                                )}
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder={t(
                                    "organization_email_placeholder",
                                    "contact@company.com"
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClasses}>
                                {t(
                                    "contact_number",
                                    "Contact Number"
                                )}
                            </label>

                            <input
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>
                                {t(
                                    "maximum_employees",
                                    "Maximum Employees"
                                )}
                            </label>

                            <input
                                type="number"
                                name="max_employees"
                                value={formData.max_employees}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>
                            {t(
                                "organization_admin_email",
                                "Organization Admin Email"
                            )}
                        </label>

                        <input
                            type="email"
                            name="admin_email"
                            value={formData.admin_email}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder={t(
                                "organization_admin_email_placeholder",
                                "admin@company.com"
                            )}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClasses}>
                            {t(
                                "organization_address",
                                "Organization Address"
                            )}
                        </label>

                        <textarea
                            rows={3}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full mt-2 min-h-[120px] border border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none resize-y transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-300"
                        >
                            {t(
                                "cancel",
                                "Cancel"
                            )}
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading
                                ? t(
                                      "creating",
                                      "Creating..."
                                  )
                                : t(
                                      "create_organization",
                                      "Create Organization"
                                  )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateOrganizationModal;