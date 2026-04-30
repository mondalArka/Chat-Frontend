import toast from "react-hot-toast";
import { verifyLoginOtp, verifyRegisterOtp } from "../../api/auth.api"
import type { ApiResponse } from "../../types/response.types";
import { UseCase, type UseCaces } from "../../types/useCase.enum";
import type { VerifySignIn } from "../types/response.types";
import { useState } from "react";
import { RoutePaths } from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import type { User } from "../../types/user.types";

export const useVerifyOtp = (): {
    handleVerify: (otp: string, sessionId: string, useCase: UseCaces) => Promise<ApiResponse<VerifySignIn> | null>,
    loading: boolean
} => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const handleVerify = async (
        otp: string,
        sessionId: string,
        useCase: UseCaces
    ): Promise<ApiResponse<VerifySignIn> | null> => {
        let res = null;
        setLoading(true);
        if (!sessionId)
            alert("SessionId not found");

        let navigateTo: string = "";
        try {
            switch (useCase) {
                case UseCase.SIGNIN: {
                    res = await verifyLoginOtp(sessionId, otp);
                    setUser(res!.data.user as User);
                    navigateTo = RoutePaths.dashboard;
                    break;
                }

                case UseCase.SIGNUP: {
                    res = await verifyRegisterOtp(sessionId, otp);
                    navigateTo = RoutePaths.login;
                    break;
                }

                default: {
                    navigateTo = RoutePaths.login;
                    break;
                }
            }
            if (!res!.success) {
                toast.error((res!.message || res!.error || "Something went wrong") as string);
                return null;
            }

            toast.success(res!.message as string);
            navigate(navigateTo);
            return res as ApiResponse<VerifySignIn>;
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Something went wrong";
            toast.error(message || "Something went wrong");
            setUser(null);
            return null;
        } finally {
            setLoading(false);;
        }
    }

    return { handleVerify, loading }
}