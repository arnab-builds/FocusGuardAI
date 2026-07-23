import api from "../api/axios";

export const getDashboardTrend = async (date = null) => {
  const response = await api.get("/api/dashboard/trend/", {
    params: date ? { date } : {},
  });

  return response.data;
};