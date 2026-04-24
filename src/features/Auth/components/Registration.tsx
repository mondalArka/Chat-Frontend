import React, { useRef } from "react"
import { useRegister } from "../hooks/useRegister";
import { Link, useNavigate } from "react-router-dom";
import { RoutePaths } from "../../../routes/routes";
import { UseCase } from "../../../types/useCase.enum";

export default function Registration() {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const { register, isLoading } = useRegister();

    const onSubmit = async () => {
        if (!nameRef.current?.value.trim()) {
            alert("Please enter the name");
            return;
        }
        if (!emailRef.current?.value.trim()) {
            alert("Please enter the email");
            return;
        }

        let sessionId = await register(emailRef.current?.value.trim(), nameRef.current?.value.trim());
        if (!sessionId)
            return;
        
        navigate(RoutePaths.otp, {
            state: { sessionId, useCase: UseCase.SIGNUP }
        });
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Create Account
                    </h2>

                    <div className="space-y-4">
                        <input
                            ref={nameRef}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="Enter your name"
                        />

                        <input
                            ref={emailRef}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        onClick={onSubmit}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </button>

                    <p className="text-sm text-center text-gray-500 mt-4">
                        Already have an account?{" "}
                        {!isLoading && <Link
                            to="/"
                            className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                            Login
                        </Link>}
                    </p>

                </div>
            </div>
        </>
    )
}