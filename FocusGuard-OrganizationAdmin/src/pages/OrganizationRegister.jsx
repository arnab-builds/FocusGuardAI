import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    KeyRound,
    Lock,
    ShieldCheck,
    User,
    UserPlus,
} from "lucide-react";

import { registerOrganizationAdmin } from "../services/authService";
import { getApiErrorMessage } from "../utils/responseUtils";

function OrganizationRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        invite_code: "",
        username: "",
        password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await registerOrganizationAdmin({
                invite_code: form.invite_code.trim(),
                username: form.username.trim(),
                password: form.password,
                confirm_password: form.confirm_password,
            });

            navigate("/login", {
                replace: true,
            });
        } catch (submitError) {
            setError(
                getApiErrorMessage(
                    submitError,
                    "Registration failed."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-5 py-10 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-[440px] rounded-2xl bg-white p-8 shadow-xl border border-slate-200 space-y-6"
            >
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                        <ShieldCheck size={28} />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Organization Admin Registration
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create your administrator account
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Invitation Code
                    </label>

                    <div className="relative">
                        <KeyRound
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            name="invite_code"
                            value={form.invite_code}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Username
                    </label>

                    <div className="relative">
                        <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password
                    </label>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Confirm Password
                    </label>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="password"
                            name="confirm_password"
                            value={form.confirm_password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating Account..." : (
                        <span className="inline-flex items-center justify-center gap-2">
                            <UserPlus size={18} />
                            Create Account
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
}

export default OrganizationRegister;
