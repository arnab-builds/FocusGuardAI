import api from "../api/api";

export const getOrganizationAnalytics = async (languageCode) => {
    const response = await api.get("organization/analytics/", {
        params: languageCode ? { language: languageCode } : undefined,
    });
    return response.data;
};

export const getUserAnalytics = async () => {
    const response = await api.get("analytics/");
    return response.data;
};

export const getDashboardTrend = async () => {
    const response = await api.get("dashboard/trend/");
    return response.data;
};
