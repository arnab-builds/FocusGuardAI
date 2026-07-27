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
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject(error);
    }

    // ==========================
    // Organization/User Deactivated
    // ==========================
    if (
      error.response.status === 401 &&
      (
        error.response.data?.detail?.includes("deactivated") ||
        error.response.data?.detail?.includes("Organization") ||
        error.response.data?.detail?.includes("organization")
      )
    ) {
      alert(
        "Your organization has been deactivated.\nPlease contact your Super Administrator."
      );

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/";

      return Promise.reject(error);
    }

    // ==========================
    // Access Token Expired
    // ==========================
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/token/refresh/"
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
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

        const newAccess = response.data.access;

        localStorage.setItem("access", newAccess);

        if (response.data.refresh) {
          localStorage.setItem(
            "refresh",
            response.data.refresh
          );
        }

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
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