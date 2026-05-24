import { API_URL } from "./config";
import { apiClient } from "./client";

export const getUsers = async () => {
    const res = await apiClient.get(`${API_URL.baseUrl}/user`);
    return res.data;
}