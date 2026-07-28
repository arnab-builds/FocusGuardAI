import api from "../api/api";

export const askOrganizationAssistant = async (message) => {
    const response = await api.post(
        "chatbot/organization-admin/chat/",
        {
            message,
        }
    );

    return response.data;
};
