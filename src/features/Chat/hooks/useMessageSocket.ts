import { useState } from "react";
import type { Message } from "../../../types/response.types";
import { createMessage, getMessages } from "../../../api/chat.api";

export const useMessagingSocket = (chatId: string) => {
    const [message, setMessage] = useState<Message[]>([]);

    const messageList = async () => {
        const res = await getMessages(chatId);
        setMessage(res.data);
    };

    const handleMessage = (msg: Message) => {
        if (String(msg.chatId) !== String(chatId)) return;
        setMessage((prev) => [...prev, msg]);
    };

    const addMessage = async (data: any) => {
        const res = await createMessage(data);
        setMessage((prev) => [...prev, res.data]);
    };

    return { message, messageList, handleMessage, addMessage };
};