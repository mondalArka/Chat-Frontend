import toast from "react-hot-toast";
import { getChats } from "../../../api/chat.api"
import { useCallback, useEffect, useState } from "react";
import type { Chat } from "../../../types/response.types";
import { useSocket } from "../../../socket/socket.context";
import { useAuth } from "../../../context/auth.context";

export const useChat = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [chats, setChats] = useState<Chat[]>([]);
    const { socket } = useSocket() as any;

    const handleNewMessage = useCallback((newMsg: any) => {
        console.log("🔥 receive-message in useChat:", newMsg); // debug
        setChats((prev) =>
            prev
                .map((chat) =>
                    chat.chatId === String(newMsg.chatId)
                        ? {
                            ...chat,
                            lastMessageContent: newMsg.message,
                            lastMessageTime: newMsg.createdAt,
                        }
                        : chat
                )
                .sort((a, b) => {
                    const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                    const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                    return bTime - aTime;
                })
        );
    }, []);

    useEffect(() => {
        console.log("🧩 socket in useChat:", socket?.id, socket?.connected)
        if (!socket) return;

        console.log("🧩 socket in useChat:", socket?.id, socket?.connected);
        socket.on("receive-message", handleNewMessage);

        return () => {
            socket.off("receive-message", handleNewMessage);
        };
    }, [socket, handleNewMessage]);

    const getChat = async (): Promise<Chat[] | null> => {
        try {
            setLoading(true);
            const res = await getChats();
            setChats(res.data);
            console.log(res.data, "chats in useChat")
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


    useEffect(() => {
        try {
            getChat();
        } catch (err) {
            console.error("Failed to fetch chats", err);
        }
    }, []);

    const onSelectedChat = (chatId: string) => {
        setSelectedChatId(chatId);
    }
    return { loading, getChat, selectedChatId, setSelectedChatId, chats, onSelectedChat }
}