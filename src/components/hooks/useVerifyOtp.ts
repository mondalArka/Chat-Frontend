import toast from "react-hot-toast";
import { verifyLoginOtp } from "../../api/auth.api"
import type { ApiResponse } from "../../types/response.types";
import { UseCase, type UseCaces } from "../../types/useCase.enum";
import type { VerifySignIn } from "../types/response.types";
import { useState } from "react";

export const useVerifyOtp = (): {
    handleVerify: (otp: string, sessionId: string, useCase: UseCaces) => Promise<ApiResponse<VerifySignIn> | null>,
    loading: boolean
} => {
    const [loading, setLoading] = useState<boolean>(false);
    const handleVerify = async (
        otp: string,
        sessionId: string,
        useCase: UseCaces
    ): Promise<ApiResponse<VerifySignIn> | null> => {
        let res = null;
        setLoading(true);
        if (!sessionId)
            alert("SessionId not found");
        try {
            switch (useCase) {
                case UseCase.SIGNIN: {
                    res = await verifyLoginOtp(sessionId, otp);
                    break;
                }

                case UseCase.SIGNUP: {
                    break;
                }

                default: {
                    break;
                }
            }

            if (!res!.success) {
                toast.error((res!.message || res!.error || "Something went wrong") as string);
                return null;
            }

            toast.success(res!.message || "Login successful");
            return res as ApiResponse<VerifySignIn>;
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Something went wrong";
            toast.error(message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);;
        }
    }

    return { handleVerify, loading }
}