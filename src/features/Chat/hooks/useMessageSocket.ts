import React, { useRef, useState, type RefObject } from "react";
import type { Message } from "../../../types/response.types";
import { createMessage, readChat } from "../../../api/chat.api";
import { useMessage } from "./useMessage";
import toast from "react-hot-toast";

export const useMessagingSocket = (chatId: string, cursorRef?: RefObject<Record<string, string>>) => {
    const [sending, setSending] = useState(false);
    const { messages, setMessages, loadMore, hasMore, loadingMore } = useMessage(chatId, cursorRef);
    const readChatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const handleMessage = (msg: Message) => {
        if (String(msg.chatId) !== String(chatId)) return;
        const isMsgExists = messages.some((m) => String(m.id) === String(msg.id));
        if (isMsgExists) return;

        setMessages((prev) => [...prev, msg]);
        if (readChatTimer.current) clearTimeout(readChatTimer.current);
        readChatTimer.current = setTimeout(async () => {
            try {
                await readChat(chatId);
            } catch (err) {
                toast.error("Failed to mark messages as read");
            }
        }, 10000);
    };

    const addMessage = async (data: any) => {
        try {
            setSending(true);
            await createMessage(data);
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(message || "Something went wrong");
        } finally {
            setSending(false);
        }
    };

    const handleLoadMore = () => {
        loadMore(messagesContainerRef);  // pass container ref for scroll restore
    };

    return { messages, addMessage, handleMessage, sending, loadMore: handleLoadMore, hasMore, loadingMore, messagesContainerRef };
};