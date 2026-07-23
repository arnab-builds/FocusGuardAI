import api from "../api/axios";

export const getNotifications = async () => {
  const response = await api.get("/api/notifications/");
  return response.data;
};