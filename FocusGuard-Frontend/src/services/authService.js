import api from "../api/axios";

export const loginUser = async (data) => {
    const response = await api.post("/api/login/", data);
    return response.data;
};