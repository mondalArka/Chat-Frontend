import { useState } from "react";
import { getUsers } from "../api/user.api";
import toast from "react-hot-toast";

export const userUserData = () => {
    const [userData, setUserData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const getUserData = async () => {
        setLoading(true);
        try {
            const res = await getUsers();
            setUserData(res.data);
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return { userData, getUserData, loading }
}