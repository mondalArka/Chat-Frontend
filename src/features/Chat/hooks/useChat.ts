import toast from "react-hot-toast";
import { getChats, readChat } from "../../../api/chat.api"
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chat } from "../../../types/response.types";
import { useSocket } from "../../../socket/socket.context";
import { useAuth } from "../../../context/auth.context";

export const useChat = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChatId, setSelectedChatId] = useState<string>('');
    const [chats, setChats] = useState<Chat[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const { socket } = useSocket() as any;
    const selectedChatIdRef = useRef<string>('');
    const { user } = useAuth();


    const handleNewMessage = useCallback((newMsg: any) => {
        console.log("🔥 receive-message in useChat:", newMsg); // debug
        setChats((prev) =>
            prev
                .map((chat) => {
                    if (chat.chatId !== String(newMsg.chatId)) return chat;

                    const isCurrentlyViewing = selectedChatIdRef.current === String(newMsg.chatId); // ✅ always fresh

                    return {
                        ...chat,
                        lastMessageContent: newMsg.message,
                        lastMessageTime: newMsg.createdAt,
                        participants: chat.participants.map((p) => ({
                            ...p,
                            unreadCount: isCurrentlyViewing
                                ? 0                                              // ✅ reset to 0 if user is in this chat
                                : String(p.userId) !== String(newMsg.sender?.id)
                                    ? (p.unreadCount || 0) + 1                  // increment for other participants
                                    : p.unreadCount                             // sender stays unchanged
                        }))
                    };
                })
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
    }, [socket]);

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
    }, [refresh]);

    const onSelectedChat = async (chatId: string) => {
        setSelectedChatId(chatId);
        try {
            await readChat(chatId);
        } catch (err) {
            toast.error("Failed to mark messages as read");
            console.error("Error marking messages as read:", err);
        }
        setChats((prev) =>
            prev.map((chat) =>
                String(chat.chatId) === String(chatId)
                    ? {
                        ...chat,
                        participants: chat.participants.map((p) =>
                            p.userId === chat.participants.find((p) => String(p.userId) === String(user?.id))?.userId
                                ? { ...p, unreadCount: 0 }
                                : p
                        )
                    }
                    : chat
            )
        );
        selectedChatIdRef.current = chatId;
    }
    return { loading, getChat, selectedChatId, setSelectedChatId, chats, onSelectedChat, setRefresh }
}