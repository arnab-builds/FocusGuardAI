import api from "../api/api";

export const askOrganizationAssistant = async (
    message,
    preferredLanguage,
    selectedDate
) => {
    const response = await api.post(
        "chatbot/organization-admin/chat/",
        {
            message,
            preferred_language_code: preferredLanguage,
            selected_date: selectedDate,
        }
    );

    return response.data;
};

export const getOrganizationChatHistory = async (selectedDate) => {
    const response = await api.get("chatbot/history/", {
        params: { selected_date: selectedDate },
    });
    return response.data;
};

export const clearOrganizationChatHistory = (selectedDate) =>
    api.delete("chatbot/history/clear/", {
        params: { selected_date: selectedDate },
    });
