import api from "../api/api";

export const getEmployees = async () => {
    const response = await api.get("organization/members/");
    return response.data;
};

export const inviteEmployee = async (data) => {
    const response = await api.post("invitation/create/", data);
    return response.data;
};

export const getActivityHistory = async () => {
    const response = await api.get("activity/history/");
    return response.data;
};

export const getOrganizationActivity = async () => {
    const response = await api.get("organization/activity/");
    return response.data;
};

export const getEmployeeBrowsingHistory = async (
    employeeId,
    { date, language, page = 1, pageSize = 10 } = {}
) => {
    const response = await api.get("organization/activity/", {
        params: {
            employee_id: employeeId,
            date: date || undefined,
            language: language || undefined,
            page,
            page_size: pageSize,
        },
    });

    return response.data;
};

export const requestEmployeeDeactivation = async () => {
    const response = await api.post("employee/deactivation-request/");
    return response.data;
};

export const getEmployeeAnalytics = async () => {
    const response = await api.get("analytics/");
    return response.data;
};
