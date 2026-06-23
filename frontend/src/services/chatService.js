import api from "./api";

export const getChatUsers = async () => (await api.get("/chat/users")).data;
export const getConversations = async () => (await api.get("/chat/conversations")).data;
export const getOrCreateConversation = async (recipientId) =>
  (await api.post("/chat/conversations", { recipientId })).data;
export const getMessages = async (conversationId) =>
  (await api.get(`/chat/conversations/${conversationId}/messages`)).data;
export const sendMessage = async (conversationId, text) =>
  (await api.post(`/chat/conversations/${conversationId}/messages`, { text })).data;
