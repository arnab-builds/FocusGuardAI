import api from "../api/api";

export const askOrganizationAssistant = async (
    message,
    preferredLanguage
) => {
    const response = await api.post(
        "chatbot/organization-admin/chat/",
        {
            message,
            preferred_language_code: preferredLanguage,
        }
    );

    return response.data;
};
