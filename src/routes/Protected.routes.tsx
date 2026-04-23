import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () =>
    !!localStorage.getItem("accessToken");

export const ProtectedRoute = () => {
    return isAuthenticated() ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
};