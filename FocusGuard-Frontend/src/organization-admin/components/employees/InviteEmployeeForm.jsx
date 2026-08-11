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
            const response = await inviteEmployee({
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
            <div className="w-full rounded-3xl border border-indigo-100/50 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-800 shadow-lg p-5 sm:p-6 xl:p-7">
                {/* Hero */}
                <div className="flex flex-col items-center text-center gap-2.5 mb-6">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center ring-1 ring-indigo-200 dark:ring-indigo-900/50">
                        <UserCircle2
                            size={30}
                            className="text-indigo-600 dark:text-indigo-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                            {t("employee_invitation", "Employee Invitation")}
                        </h2>

                        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium max-w-lg mx-auto">
                            {t(
                                "invite_employees_description",
                                "Invite new employees to join your organization."
                            )}
                        </p>

                        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-lg mx-auto">
                            {t(
                                "invite_employees_subdescription",
                                "They will receive an email containing the registration link and invite code."
                            )}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 flex gap-3 text-red-700 dark:text-red-400">
                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-2xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-3 flex gap-3 text-green-700 dark:text-green-400">
                            <CheckCircle2
                                className="shrink-0 mt-0.5"
                                size={18}
                            />
                            <p className="text-sm font-medium">{success}</p>
                        </div>
                    )}

                    <div>
                        <label className="mb-2.5 block text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                            {t("employee_email", "Employee Email")}
                        </label>

                        <div className="relative group">
                            <Mail
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"
                            />

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={t(
                                    "employee_email_placeholder",
                                    "employee@email.com"
                                )}
                                className="w-full h-12 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 pl-12 pr-4 text-base text-slate-900 dark:text-slate-200 outline-none shadow-sm transition-all duration-150 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2.5 flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                            {t("department", "Department")}

                            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {t("optional", "Optional")}
                            </span>
                        </label>

                        <div className="relative group">
                            <Building2
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"
                            />

                            <input
                                type="text"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                placeholder={t(
                                    "department_placeholder",
                                    "Software Development"
                                )}
                                className="w-full h-12 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800/50 pl-12 pr-4 text-base text-slate-900 dark:text-slate-200 outline-none shadow-sm transition-all duration-150 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
                            />
                        </div>
                    </div>

                    {/* Invitation info card */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/30 p-4 sm:p-5">
                        <div className="flex gap-4">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center ring-1 ring-indigo-100 dark:ring-indigo-900/50">
                                <UserPlus
                                    className="text-indigo-600 dark:text-indigo-400"
                                    size={20}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                                    {t("invitation", "Invitation Process")}
                                </h3>

                                <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                    {t(
                                        "invitation_description",
                                        "An invite email containing the registration link and invite code will be sent to the employee."
                                    )}
                                </p>

                                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 dark:text-indigo-400 shrink-0"
                                        />
                                        {t(
                                            "secure_invitation_link",
                                            "Secure invitation link"
                                        )}
                                    </li>

                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 dark:text-indigo-400 shrink-0"
                                        />
                                        {t(
                                            "invite_code_generated",
                                            "Invite code generated"
                                        )}
                                    </li>

                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 dark:text-indigo-400 shrink-0"
                                        />
                                        {t(
                                            "employee_completes_registration",
                                            "Employee completes registration"
                                        )}
                                    </li>

                                    <li className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CheckCircle2
                                            size={16}
                                            className="text-indigo-600 dark:text-indigo-400 shrink-0"
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

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-7 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {t("sending", "Sending...")}
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    {t("send_invitation", "Send Invitation")}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InviteEmployeeForm;
