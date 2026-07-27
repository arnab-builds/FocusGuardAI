import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            navigate("/dashboard");

        } catch (err) {
            alert(
                err.response?.data?.error ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow w-[400px] space-y-5"
            >

                <h1 className="text-2xl font-bold text-center">
                    Super Admin Login
                </h1>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />

                <button
                    className="w-full bg-blue-600 text-white py-3 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;