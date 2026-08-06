import api from "./api";

export const loginAPI = async (credentials) => {
    const response = await api.post("login/", credentials);
    return response.data;
};

export const logoutAPI = async (refresh) => {
    const response = await api.post("logout/", {
        refresh,
    });

    return response.data;
};

export const profileAPI = async () => {
    const response = await api.get("profile/");
    return response.data;
};