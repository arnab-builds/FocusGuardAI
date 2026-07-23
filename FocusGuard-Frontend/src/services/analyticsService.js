import api from "../api/axios";

export const getAnalytics = async (date = null) => {
  const response = await api.get("/api/analytics/", {
    params: date ? { date } : {},
  });

  return response.data;
};