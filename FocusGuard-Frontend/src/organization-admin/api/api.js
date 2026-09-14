import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    baseURL: import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/$/, "") + "/"
      : "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        const language = localStorage.getItem("preferredLanguage");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (language && !config.params?.language) {
            config.params = { ...config.params, language };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
