import { useEffect, useState } from "react";
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

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border p-8 max-w-5xl"
        >
            <h2 className="text-2xl font-bold mb-8">
                {t(
                    "profile_settings",
                    "Profile Settings"
                )}
            </h2>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>

            </div>

            <hr className="my-8" />

            <h3 className="text-xl font-semibold mb-6">
                {t(
                    "change_password",
                    "Change Password"
                )}
            </h3>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
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
                        className="w-full border rounded-xl p-3"
                    />
                </div>
            </div>

            <div className="mt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition"
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
