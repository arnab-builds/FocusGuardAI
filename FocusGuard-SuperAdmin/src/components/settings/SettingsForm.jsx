import { useEffect, useState } from "react";
import { User, KeyRound } from "lucide-react";
import {
    getSettings,
    updateSettings,
} from "../../services/superAdminService";
import { useLanguage } from "../../context/LanguageContext";

function SettingsForm() {
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);

    async function loadSettings() {
        try {
            const res = await getSettings();

            setFormData((prev) => ({
                ...prev,
                username: res.data.username || "",
                email: res.data.email || "",
                first_name: res.data.first_name || "",
                last_name: res.data.last_name || "",
            }));
        } catch (err) {
            console.error(err);
            alert(
                t(
                    "failed_to_load_settings",
                    "Failed to load settings."
                )
            );
        }
    }

    useEffect(() => {
        const timeout = setTimeout(
            loadSettings,
            0
        );

        return () => clearTimeout(timeout);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await updateSettings(formData);

            alert(
                t(
                    "profile_updated_successfully",
                    "Profile updated successfully."
                )
            );

            setFormData((prev) => ({
                ...prev,
                current_password: "",
                new_password: "",
                confirm_password: "",
            }));
        } catch (err) {
            alert(
                err.response?.data?.error ||
                    t(
                        "something_went_wrong",
                        "Something went wrong."
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full h-[52px] px-4 border border-slate-200 rounded-xl shadow-sm text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 hover:border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400";

    const labelClass =
        "block font-semibold text-slate-700 text-sm mb-2";

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-sm hover:shadow-lg border border-slate-100 p-6 sm:p-8 md:p-10 max-w-5xl mx-auto transition-all duration-300"
        >
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/70 text-blue-600 ring-1 ring-blue-100">
                    <User size={18} />
                </span>

                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {t(
                            "profile_settings",
                            "Profile Settings"
                        )}
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Update your personal details.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div>
                    <label className={labelClass}>
                        {t(
                            "first_name",
                            "First Name"
                        )}
                    </label>

                    <input
                        name="first_name"
                        value={
                            formData.first_name
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        {t(
                            "last_name",
                            "Last Name"
                        )}
                    </label>

                    <input
                        name="last_name"
                        value={
                            formData.last_name
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        {t(
                            "username",
                            "Username"
                        )}
                    </label>

                    <input
                        name="username"
                        value={
                            formData.username
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        {t(
                            "email",
                            "Email"
                        )}
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={
                            formData.email
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>

            </div>

            <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/70 text-indigo-600 ring-1 ring-indigo-100">
                    <KeyRound size={18} />
                </span>

                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                        {t(
                            "change_password",
                            "Change Password"
                        )}
                    </h3>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Leave blank to keep your current password.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        {t(
                            "current_password",
                            "Current Password"
                        )}
                    </label>

                    <input
                        type="password"
                        name="current_password"
                        value={
                            formData.current_password
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        {t(
                            "new_password",
                            "New Password"
                        )}
                    </label>

                    <input
                        type="password"
                        name="new_password"
                        value={
                            formData.new_password
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        {t(
                            "confirm_password",
                            "Confirm Password"
                        )}
                    </label>

                    <input
                        type="password"
                        name="confirm_password"
                        value={
                            formData.confirm_password
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="mt-10 flex sm:justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 disabled:from-blue-400 disabled:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 active:scale-95 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                >
                    {loading
                        ? t(
                              "saving",
                              "Saving..."
                          )
                        : t(
                              "save_changes",
                              "Save Changes"
                          )}
                </button>
            </div>
        </form>
    );
}

export default SettingsForm;