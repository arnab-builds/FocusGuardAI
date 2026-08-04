import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    const language = localStorage.getItem("preferredLanguage");

    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }

    if (language && !config.params?.language) {
      config.params = { ...config.params, language };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
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

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return API(originalRequest);

      } catch (err) {

        localStorage.clear();

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
