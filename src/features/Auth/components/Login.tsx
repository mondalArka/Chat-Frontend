import { useRef, } from "react";
import { useLogin } from "../hooks/useLogin";
import type { ApiResponse } from "../../../types/response.types";
import type { SignIn } from "../Types/response.types";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../../routes/routes";
import { UseCase } from "../../../types/useCase.enum";

export default function Login() {
  const { handleLogin, loading } = useLogin();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const onSubmit = async () => {
    if (loading) return;
    const email = inputRef.current?.value || ""
    if (!email) {
      alert("Please enter the email");
      return;
    }
    const data = await handleLogin(email) as ApiResponse<SignIn>;
    navigate(
      RoutePaths.otp,
      { state: { sessionId: data.data.session.sessionId, useCase: UseCase.SIGNIN } }
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg bg-white">

        {/* Side Image */}
        <div className="hidden md:flex flex-1 bg-indigo-600 flex-col items-center justify-center p-10 gap-4">
          <div className="bg-white/20 rounded-full p-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold">Welcome Back</h2>
          <p className="text-indigo-200 text-sm text-center max-w-xs">
            Connect and chat with your team in real time.
          </p>
        </div>

        {/* Form */}
        <div className="w-full md:w-96 p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign in</h1>
          <p className="text-gray-400 text-sm mb-8">Enter your email to continue</p>

          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Email address
          </label>{"    "}
          <input
            ref={inputRef}
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-gray-50 mb-6"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            onClick={() => onSubmit()}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            No account?{" "}
            <a href="#" className="text-indigo-600 font-semibold hover:underline">Sign up free</a>
          </p>
        </div>

      </div>
    </div>
  );
}