import api from "../api/axios";

export const analyzeRecommendation = async (payload) => {
  const { language, ...recommendationPayload } = payload;
  const response = await api.post(
    "/api/recommendations/analyze/",
    recommendationPayload,
    {
      params: language ? { language } : undefined,
    }
  );

  return response.data;
};

export const getAIRecommendations = async (date, languageCode) => {
  const response = await api.get(
    "/api/recommendations/",
    {
      params: {
        ...(date ? { date } : {}),
        ...(languageCode ? { language: languageCode } : {}),
      },
    }
  );

  return response.data;
};
