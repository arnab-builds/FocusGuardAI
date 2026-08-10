import { useState } from "react";

import {
    UserPlus,
    Mail,
    Building2,
    Send,
    UserCircle2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { inviteEmployee } from "../../services/employeeService";
import { getApiErrorMessage } from "../../utils/responseUtils";

function InviteEmployeeForm({ onInvitationSent }) {
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
            onInvitationSent?.(response.invitation);
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
        <div className="w-full">
            <div className="w-full rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white shadow-lg p-5 sm:p-6 xl:p-7">
                {/* Hero */}
                <div className="flex flex-col items-center text-center gap-2.5 mb-6">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center ring-1 ring-indigo-200">
                        <UserCircle2
                            size={30}
                            className="text-indigo-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {t(
                                "employee_invitation",
                                "Employee Invitation"
                            )}
                        </h2>

                        <p className="text-slate-500 text-sm sm:text-base font-medium max-w-lg mx-auto">
                            {t(
                                "invite_employees_description",
                                "Invite new employees to join your organization."
                            )}
                        </p>

                        <p className="text-slate-400 text-sm max-w-lg mx-auto">
                            {t(
                                "invite_employees_subdescription",
                                "They will receive an email containing the registration link and invite code."
                            )}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2.5 block text-sm sm:text-base font-semibold text-slate-700">
                            {t(
                                "employee_email",
                                "Employee Email"
                            )}
                        </label>

                        <div className="relative group">
                            <Mail
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
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
                                className="w-full h-12 rounded-2xl border border-slate-300 pl-12 pr-4 text-base outline-none shadow-sm transition-all duration-150 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2.5 flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700">
                            {t(
                                "department",
                                "Department"
                            )}

                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                                {t(
                                    "optional",
                                    "Optional"
                                )}
                            </span>
                        </label>

                        <div className="relative group">
                            <Building2
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
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
                                className="w-full h-12 rounded-2xl border border-slate-300 pl-12 pr-4 text-base outline-none shadow-sm transition-all duration-150 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Invitation info card */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-indigo-50 to-violet-50 border border-indigo-100 p-4 sm:p-5">
                        <div className="flex gap-4">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center ring-1 ring-indigo-100">
                                <UserPlus
                                    className="text-indigo-600"
                                    size={20}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                                    {t(
                                        "invitation",
                                        "Invitation Process"
                                    )}
                                </h3>

                                <p className="mt-1.5 text-sm sm:text-base text-slate-600">
                                    {t(
                                        "invitation_description",
                                        "An invite email containing the registration link and invite code will be sent to the employee."
                                    )}
                                </p>

                                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 shrink-0"
                                        />
                                        {t(
                                            "secure_invitation_link",
                                            "Secure invitation link"
                                        )}
                                    </li>

                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 shrink-0"
                                        />
                                        {t(
                                            "invite_code_generated",
                                            "Invite code generated"
                                        )}
                                    </li>

                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 shrink-0"
                                        />
                                        {t(
                                            "employee_completes_registration",
                                            "Employee completes registration"
                                        )}
                                    </li>

                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 shrink-0"
                                        />
                                        {t(
                                            "organization_approval",
                                            "Organization approval"
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-7 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />
                                {t(
                                    "sending",
                                    "Sending..."
                                )}
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                {t(
                                    "send_invitation",
                                    "Send Invitation"
                                )}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    {success && (
                        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                            <CheckCircle2
                                size={22}
                                className="text-green-600 shrink-0 mt-0.5"
                            />

                            <p className="text-sm sm:text-base font-semibold text-green-700">
                                {success}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                            <AlertCircle
                                size={22}
                                className="text-red-600 shrink-0 mt-0.5"
                            />

                            <p className="text-sm sm:text-base font-semibold text-red-700">
                                {error}
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default InviteEmployeeForm;
