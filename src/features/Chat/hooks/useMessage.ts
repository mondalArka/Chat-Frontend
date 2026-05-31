import { useCallback, useEffect, useState, type RefObject } from "react";
import toast from "react-hot-toast";
import { getMessages } from "../../../api/chat.api";

export const useMessage = (chatId: string, cursorRef?: RefObject<Record<string, string>>) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchMessage = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getMessages(chatId);          // initial — no cursor, always latest 50
            if (cursorRef?.current)
                cursorRef.current[chatId] = res?.nextCursor;  // save cursor
            setHasMore(!!res?.nextCursor);
            setMessages(res?.data.reverse());
            
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to fetch messages";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    const loadMore = useCallback(async (containerRef?: React.RefObject<HTMLDivElement | null>) => {
        const cursor = cursorRef?.current?.[chatId];
        if (!hasMore || loadingMore || !cursor) return;

        setLoadingMore(true);
        const prevScrollHeight = containerRef?.current?.scrollHeight ?? 0;

        try {
            const res = await getMessages(chatId, cursor);  // pass cursor for older messages
            if (cursorRef?.current)
                cursorRef.current[chatId] = res?.nextCursor;  // update cursor
            setHasMore(!!res?.nextCursor);
            setMessages(prev => [...res?.data.reverse(), ...prev]);     // prepend older messages

            // restore scroll position
            requestAnimationFrame(() => {
                if (containerRef?.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight - prevScrollHeight;
                }
            });
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to load more";
            toast.error(msg);
        } finally {
            setLoadingMore(false);
        }
    }, [chatId, hasMore, loadingMore]);

    useEffect(() => {
        if (!chatId) return;
        fetchMessage();
    }, [fetchMessage]);

    return { messages, loading, fetchMessage, setMessages, loadMore, hasMore, loadingMore };
};