import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// Attach Access Token
// ==========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// Auto Refresh Access Token
// ==========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/token/refresh/"
    ) {
      originalRequest._retry = true;

      console.log("⚠️ Access token expired.");
      console.log("🔄 Trying to refresh...");

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        console.log("❌ No refresh token found.");

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh,
          }
        );

        console.log("✅ Token refreshed successfully.");
        console.log(response.data);

        const newAccess = response.data.access;

        // Save new access token
        localStorage.setItem("access", newAccess);

        // Save new refresh token if your backend rotates it
        if (response.data.refresh) {
          localStorage.setItem("refresh", response.data.refresh);
        }

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        console.log("🔁 Retrying:", originalRequest.url);

        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh Token Expired");
        console.error(refreshError.response?.data);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;