import api from "../api/axios";

export const getActivityHistory = async () => {
  const response = await api.get("/api/activity/history/");

  console.log("Activity Response:", response.data);

  return response.data;
};