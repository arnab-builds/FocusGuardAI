import api from "../api/axios";

export const getAnalytics = async () => {
  try {
    const response = await api.get("/api/analytics/");
    return response.data;
  } catch (error) {
    console.error("Analytics API Error:", error);
    throw error;
  }
};