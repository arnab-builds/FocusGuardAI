import api from "../api/api";

export const getDashboardTrend = async () => {
    const response = await api.get("dashboard/trend/");
    return response.data;
};

export const getOrganizationAnalytics = async () => {
    const response = await api.get("organization/analytics/");
    return response.data;
};

export const getOrganizationActivity = async (language) => {
    const response = await api.get("organization/activity/", {
        params: language ? { language } : undefined,
    });
    return response.data;
};

export const getOrganizationMembers = async () => {
    const response = await api.get("organization/members/");
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("profile/");
    return response.data;
};
