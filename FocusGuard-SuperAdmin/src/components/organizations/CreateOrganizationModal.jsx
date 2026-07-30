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

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl w-[700px] shadow-xl">
                <div className="flex justify-between items-center border-b p-6">
                    <h2 className="text-2xl font-bold">
                        {t(
                            "create_organization",
                            "Create Organization"
                        )}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >
                    <div>
                        <label className="font-medium">
                            {t(
                                "organization_name",
                                "Organization Name"
                            )}
                        </label>

                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-xl p-3"
                            placeholder={t(
                                "organization_name_placeholder",
                                "Google Pvt Ltd"
                            )}
                            required
                        />
                    </div>

                    <div>
                        <label className="font-medium">
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
                            className="w-full mt-2 border rounded-xl p-3"
                            placeholder={t(
                                "organization_email_placeholder",
                                "contact@company.com"
                            )}
                        />
                    </div>

                    <div>
                        <label className="font-medium">
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
                            className="w-full mt-2 border rounded-xl p-3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="font-medium">
                                {t(
                                    "contact_number",
                                    "Contact Number"
                                )}
                            </label>

                            <input
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-medium">
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
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-medium">
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
                            className="w-full mt-2 border rounded-xl p-3"
                            placeholder={t(
                                "organization_admin_email_placeholder",
                                "admin@company.com"
                            )}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl border"
                        >
                            {t(
                                "cancel",
                                "Cancel"
                            )}
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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