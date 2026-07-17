import api from "../api/axios";

export const getProfile = async () => {
  try {
    const response = await api.get("/api/profile/");
    return response.data;
  } catch (error) {
    console.error("Profile API Error:", error);
    throw error;
  }
};