import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe2 } from "lucide-react";

import { superAdminLogin } from "../services/authService";
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

        try {
            const res = await superAdminLogin(form);

            localStorage.setItem(
                "access",
                res.data.access
            );

            localStorage.setItem(
                "refresh",
                res.data.refresh
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            await setLanguageFromPreference(
                res.data.user?.preferred_language
            );

            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.error ||
                "Login failed"
            );
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
                        className="rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                className="bg-white p-8 rounded-xl shadow w-[400px] space-y-5"
            >
                <h1 className="text-2xl font-bold text-center">
                    {t("super_admin_login", "Super Admin Login")}
                </h1>

                <input
                    type="text"
                    name="username"
                    placeholder={t("username", "Username")}
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder={t("password", "Password")}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />

                <button
                    className="w-full bg-blue-600 text-white py-3 rounded"
                >
                    {t("login", "Login")}
                </button>
            </form>
        </div>
    );
}

export default Login;
