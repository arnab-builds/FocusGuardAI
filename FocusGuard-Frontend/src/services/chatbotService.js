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

export const getChatHistory = async (selectedDate, languageCode) => {
  const response = await api.get("/api/chatbot/history/", {
    params: { selected_date: selectedDate, ...(languageCode ? { language: languageCode } : {}) },
  });
  return response.data;
};

export const getAllChatHistory = async (languageCode) => {
  const response = await api.get("/api/chatbot/history/", {
    params: { all_dates: true, ...(languageCode ? { language: languageCode } : {}) },
  });
  return response.data;
};

export const clearChatHistory = async (selectedDate) =>
  api.delete("/api/chatbot/history/clear/", { params: { selected_date: selectedDate } });
