import { apiClient } from "./client";

export const getChats = async () => {
    const res = await apiClient.get("/chat");
    return res.data;
}