import api from "../api/axios";

export const analyzeRecommendation = async (payload) => {
  const response = await api.post(
    "/api/recommendations/analyze/",
    payload
  );

  return response.data;
};

export const getAIRecommendations = async () => {
  const response = await api.get(
    "/api/recommendations/"
  );

  return response.data;
};