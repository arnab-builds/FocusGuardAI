import api from "../api/api";

export const getProfile = async () => {
    const response = await api.get("profile/");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put("profile/", data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.put("change-password/", data);
    return response.data;
};

export const getOrganizationDetails = async () => {
    const response = await api.get("organization/details/");
    return response.data;
};

export const updateOrganizationDetails = async (data) => {
    const response = await api.put(
        "organization/details/",
        data
    );
    return response.data;
};

export const requestOrganizationDeactivation = async (data) => {
    const response = await api.post(
        "organization/deactivation-request/",
        data
    );
    return response.data;
};
