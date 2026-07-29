import api from "../api/axios";

export const getDashboardTrend = async (date = null, signal) => {
  const response = await api.get("/api/dashboard/trend/", {
    params: date ? { date } : {},
    signal,
  });

  return response.data;
};
