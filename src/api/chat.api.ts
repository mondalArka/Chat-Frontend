import { apiClient } from "./client";

export const getChats = async () => {
    const res = await apiClient.get("/chat");
    return res.data;
}

export const getMessages = async (chatId: string) => {
    const res = await apiClient.get(`/message/${chatId}`);
    return res.data;
}

export const createMessage = async (data: FormData) => {
    const res = await apiClient.post("/message", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

export const readChat = async (chatId: string) => {
    const res = await apiClient.patch("/chat/read", {
        chatId
    });
    return res.data;
} 

export const createChat = async (data: any) => {
    const res = await apiClient.post("/chat", data);
    return res.data;
}