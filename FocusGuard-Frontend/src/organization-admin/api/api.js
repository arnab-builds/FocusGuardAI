import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/$/, "") + "/"
      : "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise = null;

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
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest?._retry &&
            !originalRequest?.url?.includes("token/refresh/")
        ) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem("refresh");

            if (refresh) {
                try {
                    if (!refreshPromise) {
                        refreshPromise = axios.post(
                            `${api.defaults.baseURL}token/refresh/`,
                            { refresh }
                        ).finally(() => {
                            refreshPromise = null;
                        });
                    }

                    const response = await refreshPromise;
                    const access = response.data.access;
                    localStorage.setItem("access", access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Session refresh failed", refreshError);
                }
            }

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
