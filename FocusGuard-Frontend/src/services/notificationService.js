import api from "../api/axios";

export const getNotifications = async (languageCode, signal) => {
  const response = await api.get("/api/notifications/", {
    params: languageCode ? { language: languageCode } : undefined,
    signal,
  });
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read/`);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/api/notifications/${id}/`);
  return response.data;
};
