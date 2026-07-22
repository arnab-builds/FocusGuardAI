import api from "../api/axios";

/**
 * Get User Settings
 */
export const getUserSettings = async () => {
  try {
    const response = await api.get("/api/settings/");
    return response.data;
  } catch (error) {
    console.error("Settings API Error:", error);
    throw error;
  }
};

/**
 * Update User Settings
 */
export const updateUserSettings = async (settings) => {
  try {
    const response = await api.patch("/api/settings/", settings);
    return response.data;
  } catch (error) {
    console.error("Update Settings API Error:", error);
    throw error;
  }
};