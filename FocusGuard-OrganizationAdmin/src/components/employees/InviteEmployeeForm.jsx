import { useState } from "react";

import {
    UserPlus,
    Mail,
    Building2,
    Send,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { inviteEmployee } from "../../services/employeeService";
import { getApiErrorMessage } from "../../utils/responseUtils";

function InviteEmployeeForm() {
    const { t } = useLanguage();

    const [form, setForm] = useState({
        email: "",
        department: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const response =
                await inviteEmployee({
                    email: form.email,
                    role: "USER",
                });

            setSuccess(
                response.message ||
                    t(
                        "invitation_sent_successfully",
                        "Invitation sent successfully."
                    )
            );

            setForm({
                email: "",
                department: "",
            });
        } catch (submitError) {
            setError(
                getApiErrorMessage(
                    submitError,
                    t(
                        "invitation_send_failed",
                        "Invitation could not be sent."
                    )
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        {t(
                            "employee_email",
                            "Employee Email"
                        )}
                    </label>

                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={
                                handleChange
                            }
                            placeholder={t(
                                "employee_email_placeholder",
                                "employee@email.com"
                            )}
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        {t(
                            "department",
                            "Department"
                        )}
                    </label>

                    <div className="relative">
                        <Building2
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            name="department"
                            value={
                                form.department
                            }
                            onChange={
                                handleChange
                            }
                            placeholder={t(
                                "department_placeholder",
                                "Software Development"
                            )}
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-5">
                    <div className="flex gap-3">
                        <UserPlus
                            className="text-indigo-600 mt-1"
                            size={20}
                        />

                        <div>
                            <h3 className="font-semibold text-slate-800">
                                {t(
                                    "invitation",
                                    "Invitation"
                                )}
                            </h3>

                            <p className="mt-1 text-sm text-slate-600">
                                {t(
                                    "invitation_description",
                                    "An invite email containing the registration link and invite code will be sent to the employee."
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
                >
                    <Send size={18} />

                    {loading
                        ? t(
                              "sending",
                              "Sending..."
                          )
                        : t(
                              "send_invitation",
                              "Send Invitation"
                          )}
                </button>

                {success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}

export default InviteEmployeeForm;