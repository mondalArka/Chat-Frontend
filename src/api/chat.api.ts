import type { ApiResponse, NotificationResponse } from "../types/response.types";
import { apiClient } from "./client";

export const getChats = async () => {
    const res = await apiClient.get("/chat");
    return res.data;
}

export const getMessages = async (chatId: string, cursor: string = "initial") => {
    const res = await apiClient.get(`/message/${chatId}${`?cursor=${cursor}`}`);
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

export const getParticipantsForChat = async (chatId: string) => {
    const res = await apiClient.get(`/chat/${chatId}`);

    return res.data;
}

export const inviteStrangers = async (email: string) => {
    const res = await apiClient.post("/invite", { email });
    return res.data;
}

export const getNotification = async (limit = 10, page = 1): Promise<NotificationResponse> => {
    const res = await apiClient.get(`/notifications?limit=${limit}&page=${page}`);
    return res.data as NotificationResponse;
}

export const readNotification = async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}`);
    return res.data;
}


export const markAllAsRead = async () => {
    const res = await apiClient.patch(`/notifications`);
    return res.data;
}

export const readByChatIdNotification = async (chatId: string) => {
    const res = await apiClient.patch(`/notifications/chat`, { chatId });
    return res.data;
}