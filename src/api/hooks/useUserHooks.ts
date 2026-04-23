import { useEffect, useState } from "react"
import type { User } from "../../types/user.types"
import { apiClient } from "../client"
import { getMe } from "../auth.api"

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        getMe()
            .then((data) => setUser(data))
            .catch(() => setUser(null))
    }, [])
    return { user, isAuthenticated: !!user };
}