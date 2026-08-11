import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/api/login/", credentials);

  return response.data;
};

export const registerEmployee = async (data) => {
  const response = await api.post("/api/employee-register/", data);

  return response.data;
};

export const registerNormalUser = async (data) => {
  const response = await api.post("/api/normal-user-register/", data);
  return response.data;
};

export const getActiveLanguages = async () => {
  const response = await api.get("/api/languages/");

  return response.data;
};

export const getTranslations = async (languageCode, config = {}) => {
  const response = await api.get("/api/translations/", {
    params: {
      language: languageCode,
    },
    ...config,
  });

  return response.data;
};

export const logoutUser = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    await api.post("/api/logout/", {
      refresh,
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};
