import api from "../api/axios";

export const getActivityHistory = async (page = 1, date = null) => {
  const response = await api.get("/api/activity/history/", {
    params: {
      page,
      ...(date ? { date } : {}),
    },
  });

  return response.data;
};