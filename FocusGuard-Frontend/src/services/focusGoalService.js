import api from "../api/axios";

export const getGoals = async () => {
  const response = await api.get("/api/focus/goals/");
  return response.data;
};

export const createGoal = async (data) => {
  const response = await api.post("/api/focus/goals/", data);
  return response.data;
};

export const updateGoal = async (id, data) => {
  const response = await api.put(`/api/focus/goals/${id}/`, data);
  return response.data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/api/focus/goals/${id}/`);
};

export const generateFocusPlan = async (id) => {
  const response = await api.post(
    `/api/focus/goals/${id}/generate-plan/`
  );
  return response.data;
};

export const regenerateFocusPlan = async (id) => {
  const response = await api.post(
    `/api/focus/goals/${id}/generate-plan/`
  );
  return response.data;
};

export const getFocusPlan = async (id) => {
  const response = await api.get(
    `/api/focus/goals/${id}/plan/`
  );
  return response.data;
};