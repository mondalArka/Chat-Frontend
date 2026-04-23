import { API_URL } from "./config";
import axios from "axios";


export const apiClient = axios.create({
    baseURL: API_URL.baseUrl,
    withCredentials: true,
});
// in case token not found just for practice
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
