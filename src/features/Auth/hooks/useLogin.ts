import { useState } from "react";
import { login } from "../../../api/auth.api";
import type { ApiResponse } from "../../../types/response.types";
import type { SignIn } from "../Types/response.types";
import toast from "react-hot-toast";

export const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (email: string): Promise<ApiResponse<SignIn> | null> => {
        try {
            setLoading(true);
            const data = await login(email);
            if (!data.success) {
                toast.error((data.message || data.error || "Something went wrong") as string);
                return null;
            }
            toast.success(data.message || "Verify OTP");
            return data as ApiResponse<SignIn>;
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading };
};