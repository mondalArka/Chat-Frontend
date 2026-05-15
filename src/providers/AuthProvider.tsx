import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context"
import type { User } from "../types/user.types";
import { apiClient } from "../api/client";
import { getMe } from "../api/auth.api";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getMe().then((data) => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);
    const logout = async () => {
        try {
            await apiClient.get("/auth/logout");
        } catch { }
        setUser(null);
    };
    if (loading) return null
    console.log( {
                    isAuthenticated: !!user,
                    user,
                    // logout,
                    // setUser
                })
    return (
        <AuthContext.Provider
            value={
                {
                    isAuthenticated: !!user,
                    user,
                    logout,
                    setUser
                }
            }
        >
            {children}
        </ AuthContext.Provider>
    )

}