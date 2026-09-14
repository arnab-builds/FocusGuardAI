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

import { clearCache } from "../utils/apiCache";

export const logoutUser = () => {
  const refresh = localStorage.getItem("refresh");
  
  // Wipe local state immediately (Synchronous)
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  clearCache();

  // Fire revocation to backend in background (Best effort)
  if (refresh) {
    api.post("/api/logout/", { refresh }).catch((error) => {
      console.error("Logout revocation failed:", error);
    });
  }
};
