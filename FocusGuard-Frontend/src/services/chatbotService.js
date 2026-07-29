import api from "../api/axios";

export const sendChatMessage = async (
  message,
  selectedDate,
  languageCode
) => {
  const response = await api.post("/api/chatbot/chat/", {
    message,
    selected_date: selectedDate,
    ...(languageCode ? { language: languageCode } : {}),
  });

  return response.data;
};
