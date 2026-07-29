import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe2 } from "lucide-react";

import { login } from "../services/authService";
import { useLanguage } from "../context/LanguageContext";

function Login() {
    const navigate = useNavigate();
    const {
        currentLanguageCode,
        languages,
        setLanguageByCode,
        setLanguageFromPreference,
        t,
    } = useLanguage();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handlePublicLanguageChange = async (event) => {
        await setLanguageByCode(event.target.value);
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const data = await login(form);

            await setLanguageFromPreference(
                data.user?.preferred_language
            );

            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.error ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-100">
            <div className="absolute right-5 top-5">
                <div className="relative">
                    <Globe2
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <select
                        value={currentLanguageCode}
                        onChange={handlePublicLanguageChange}
                        aria-label={t(
                            "preferred_language",
                            "Preferred Language"
                        )}
                        className="rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    >
                        {languages.map((language) => (
                            <option
                                key={language.id}
                                value={language.language_code}
                            >
                                {language.native_name || language.language_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white w-[420px] rounded-2xl shadow-xl p-8 space-y-6"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        {t(
                            "organization_admin",
                            "Organization Admin"
                        )}
                    </h1>

                    <p className="text-slate-500 mt-2">
                        {t(
                            "organization_admin_login_subtitle",
                            "Login to FocusGuard AI"
                        )}
                    </p>
                </div>

                <input
                    type="text"
                    name="username"
                    placeholder={t("username", "Username")}
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder={t("password", "Password")}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl py-3 font-semibold"
                >
                    {loading
                        ? t("logging_in", "Logging in...")
                        : t("login", "Login")}
                </button>
            </form>
        </div>
    );
}

export default Login;
