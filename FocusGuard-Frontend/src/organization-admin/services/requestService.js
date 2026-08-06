import api from "../api/api";

export const getRequests = async () => {
    const response = await api.get(
        "employee/deactivation-requests/"
    );
    return response.data;
};

export const approveRequest = async (requestId) => {
    const response = await api.post(
        `employee/deactivation-request/${requestId}/approve/`
    );
    return response.data;
};

export const rejectRequest = async (requestId) => {
    const response = await api.post(
        `employee/deactivation-request/${requestId}/reject/`
    );
    return response.data;
};