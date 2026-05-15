import { API_URL } from "./config";
import axios from "axios";


export const apiClient = axios.create({
    baseURL: API_URL.baseUrl,
    withCredentials: true,
});
// in case token not found just for practice
apiClient.interceptors.response.use(
    (res => res),
    (err) => {
        console.log(err.config.url)
        if (err.response?.status === 401 && err.config.url !== "/auth/me") {
            window.location.href = "/";
        }
        return Promise.reject(err);
    }
);
