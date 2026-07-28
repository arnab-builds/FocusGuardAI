import api from "../api/api";

export const analyzeRecommendation = async (
    data
) => {

    const response =
        await api.post(
            "recommendations/analyze/",
            data
        );

    return response.data;

};