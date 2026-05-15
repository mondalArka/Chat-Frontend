import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { SocketProvider } from "../socket/socket.context";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? (
            <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
};