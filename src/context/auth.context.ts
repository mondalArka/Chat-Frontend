import { createContext, useContext } from "react";
import type { User } from "../types/user.types";

export type AuthContext = {
    isAuthenticated: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
    isAuthenticated: false,
    user: null,
    setUser: () => { },
    logout: async () => { },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}