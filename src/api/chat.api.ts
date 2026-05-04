import { apiClient } from "./client";

export const getChats = async () => {
    const res = await apiClient.get("/chat");
    return res.data;
}

export const getMessages = async (chatId: string) => {
    const res = await apiClient.get(`/message/${chatId}`);
    return res.data;
}