import React, { useState, useRef, useEffect } from "react";
import type { OTPProps } from "../types/props.types";
import { UseCase } from "../types/useCase.enum";
import { useVerifyOtp } from "./hooks/useVerifyOtp";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../routes/routes";

export default function OTPInput(
    { length = 6,
    }: OTPProps
) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const location = useLocation();
    const { sessionId, useCase = UseCase.DEFAULT } = location.state || {};
    const { handleVerify, loading } = useVerifyOtp();
    const navigate = useNavigate();
    console.log(otp, "otp")

    useEffect(() => {
        if (!sessionId || !useCase || useCase === UseCase.DEFAULT)
            navigate("/");
    })
    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return; // only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const onSubmit = async () => {
        await handleVerify(otp.join(""), sessionId || "", useCase);
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
                <h2 className="text-xl font-semibold mb-6">Enter OTP</h2>

                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-14 h-14 text-center text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    ))}
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium cursor-pointer"
                    onClick={onSubmit}
                >
                    {loading ? "Verifying" : "Verify"}
                </button>
                {!loading && (
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>

                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
}
