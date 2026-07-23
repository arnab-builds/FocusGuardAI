import api from "../api/axios";

export const getDailyReport = async (date = null) => {
  const response = await api.get("/api/reports/daily/", {
    params: date ? { date } : {},
  });

  return response.data;
};

export const getWeeklyReport = async (date = null) => {
  const response = await api.get("/api/reports/weekly/", {
    params: date ? { date } : {},
  });

  return response.data;
};

export const getMonthlyReport = async (date = null) => {
  const response = await api.get("/api/reports/monthly/", {
    params: date ? { date } : {},
  });

  return response.data;
};