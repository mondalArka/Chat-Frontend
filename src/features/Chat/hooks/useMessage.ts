import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMessages } from "../../../api/chat.api";

export const useMessage = (chatId: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchMessage = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getMessages(chatId);
            setMessages(res.data);

        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to fetch messages";

            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        if (!chatId) return;

        fetchMessage(); // ✅ just call it
    }, [fetchMessage]);

    return { messages, loading, fetchMessage, setMessages };
};