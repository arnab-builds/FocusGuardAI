import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
 const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);

      console.log("Login Response:", data);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center p-6">

    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-700 to-blue-600 text-white p-12">

        <h1 className="text-5xl font-extrabold mb-6">
          FocusGuard
        </h1>

        <p className="text-lg leading-8 text-blue-100">
          Monitor productivity, track activity, analyze reports,
          and improve focus with one powerful dashboard.
        </p>

        <div className="mt-12 space-y-4">

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <p>Real-time Activity Tracking</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <p>AI Productivity Insights</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <p>Daily Analytics & Reports</p>
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="p-10 md:p-14">

        <h2 className="text-4xl font-bold text-slate-800">
          Welcome Back
        </h2>

        <p className="text-slate-500 mt-2 mb-8">
          Sign in to continue to FocusGuard
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3">
            {error}
          </div>
        )}

        {/* Username */}

        <div className="relative mb-5">

          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

        </div>

        {/* Password */}

        <div className="relative mb-8">

          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-12 pr-12 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showPassword ? (
              <FiEyeOff />
            ) : (
              <FiEye />
            )}
          </button>

        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full rounded-xl py-3 font-semibold text-white transition ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Secure authentication powered by JWT
        </p>

      </div>

    </div>

  </div>
);
}

export default Login;
