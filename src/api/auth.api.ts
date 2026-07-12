import type { VerifySignIn } from "../components/types/response.types";
import type { SignIn } from "../features/Auth/Types/response.types";
import type { ApiResponse, SessionType } from "../types/response.types";
import type { User } from "../types/user.types";
import { apiClient } from "./client";
export const login = async (email: string): Promise<ApiResponse<SignIn>> => {
    const data = await apiClient.post("/auth/signin", { email });
    return data.data;
}

export const verifyLoginOtp = async (sessionId: string, otp: string): Promise<ApiResponse<VerifySignIn>> => {
    const data = await apiClient.post("/auth/login-verify", { sessionId, otp });
    return data.data;
}

export const getMe = async (): Promise<User> => {
    const res = await apiClient.get("/auth/me");
    return res.data.data.user;
};

export const registerUser = async (email: string, name: string): Promise<ApiResponse<SessionType>> => {
    const res = await apiClient.post("/auth/signup", { email, name });
    return res.data;
}

export const verifyRegisterOtp = async (sessionId: string, otp: string): Promise<ApiResponse<VerifySignIn>> => {
    const res = await apiClient.post("/auth/verify-registration", { sessionId, otp });
    return res.data;
}

export const logout = async (): Promise<void> => {
    await apiClient.get("/auth/logout");
}