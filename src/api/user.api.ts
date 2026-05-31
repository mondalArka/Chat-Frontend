import { API_URL } from "./config";
import { apiClient } from "./client";

export const getUsers = async (refresh: boolean = false) => {
    const res = await apiClient.get(`${API_URL.baseUrl}/user?refresh=${refresh}`);
    return res.data;
}