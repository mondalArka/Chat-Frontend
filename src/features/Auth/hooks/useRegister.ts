import { useState } from "react";
import { registerUser } from "../../../api/auth.api";
import toast from "react-hot-toast";
import type { SessionType } from "../../../types/response.types";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const delay  = ()=> new Promise(resolve=>setTimeout(resolve,2000));
    const register = async (email: string, name: string): Promise<SessionType | null> => {
        setIsLoading(true);
        try {
            await delay();
            const res = await registerUser(email, name);
            if (!res.success) {
                toast.error((res.message || res.error || "Something went wrong") as string);
                return null;
            }
            toast.success(res.message || "Verify OTP");
            return res.data.sessionId as unknown as SessionType;
        } catch (err: any) {
            console.log(err);
            const message = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(message || "Something went wrong");
            return null;
        } finally {
            setIsLoading(false);
        }
    }
    return { isLoading, register, setIsLoading }
}