import api from "../api/axios";

export async function getNotifications() {
    const response = await api.get("/api/notifications/");
    return response.data;
}

export async function markNotificationRead(id) {
    const response = await api.patch(
        `/api/notifications/${id}/read/`
    );

    return response.data;
}