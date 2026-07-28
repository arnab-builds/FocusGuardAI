import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value,

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

    await login(form);

    navigate("/dashboard");

}
        catch (err) {

            alert(

                err.response?.data?.error ||

                "Login failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white w-[420px] rounded-2xl shadow-xl p-8 space-y-6"
            >

                <div className="text-center">

                    <h1 className="text-3xl font-bold text-slate-800">

                        Organization Admin

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Login to FocusGuard AI

                    </p>

                </div>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl py-3 font-semibold"
                >

                    {

                        loading

                            ? "Logging in..."

                            : "Login"

                    }

                </button>

            </form>

        </div>

    );

}

export default Login;