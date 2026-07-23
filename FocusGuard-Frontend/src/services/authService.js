import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/api/login/", credentials);

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