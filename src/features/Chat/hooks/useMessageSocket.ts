import { useState } from "react";
import type { Message } from "../../../types/response.types";
import { createMessage, getMessages } from "../../../api/chat.api";
import { useMessage } from "./useMessage";
import { useAuth } from "../../../context/auth.context";

export const useMessagingSocket = (chatId: string) => {
    const { messages, setMessages } = useMessage(chatId);
    const { user } = useAuth();
    const messageList = async () => {
        const res = await getMessages(chatId);
        setMessages(res.data);
    };

    const handleMessage = (msg: Message) => {
        if (String(msg.chatId) !== String(chatId)) return;
        const isMsgExists = messages.reverse().some((m) => String(m.id) === String(msg.id));
        if (isMsgExists) return;
        
        setMessages((prev) => [...prev, msg]);
    };

    const addMessage = async (data: any) => {
        await createMessage(data);
    };

    return { messages, messageList, addMessage, handleMessage };
};