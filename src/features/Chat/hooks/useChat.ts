import toast from "react-hot-toast";
import { getChats } from "../../../api/chat.api"
import { useEffect, useState } from "react";
import type { Chat } from "../../../types/response.types";

export const useChat = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        getChat();
    },[])
    const getChat = async (): Promise<Chat[] | null> => {
        try {
            setLoading(true);
            const res = await getChats();
            setChats(res.data);
            return res;
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(message);
            setChats([]);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const onSelectedChat = (chatId: string) => {
        setSelectedChatId(chatId);
    }
    return { loading, getChat, selectedChatId, setSelectedChatId, chats, onSelectedChat }
}