import api from "../api/axios";

export const sendChatMessage = async (
  message,
  selectedDate
) => {
  const response = await api.post("/api/chatbot/chat/", {
    message,
    selected_date: selectedDate,
  });

  return response.data;
};