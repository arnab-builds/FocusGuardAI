import api from "../api/axios";

export const getAIRecommendations = async () => {
  try {
    const response = await api.get("/api/recommendations/");

    console.log("AI Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("AI Error:", error.response?.status);
    console.error(error.response?.data);

    return [];
  }
};