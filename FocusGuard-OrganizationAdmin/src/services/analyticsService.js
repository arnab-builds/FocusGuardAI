import api from "../api/api";

export const getOrganizationAnalytics = async () => {
    const response = await api.get("organization/analytics/");
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