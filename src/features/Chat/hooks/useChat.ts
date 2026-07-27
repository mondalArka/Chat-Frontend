import toast from "react-hot-toast";
import {
  getChats,
  getParticipantsForChat,
  readByChatIdNotification,
  readChat,
  getNotification,
  markAllAsRead,
  readNotification,
} from "../../../api/chat.api";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ApiResponse,
  Chat,
  NotificationResponse,
  Notification,
} from "../../../types/response.types";
import { useSocket } from "../../../socket/socket.context";
import { useAuth } from "../../../context/auth.context";
import type { User } from "../../../types/user.types";

export const useChat = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isAllNotifRead, setIsAllNotifRead] = useState<boolean>(false);
  const [isNotifOpened, setIsNotifOpened] = useState<boolean>(false);

  // ✅ notification state — moved here from SideBar + NotificationComp
  const [notification, setNotification] = useState<NotificationResponse>();
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [notifRefresh, setNotifRefresh] = useState(false);

  const { socket } = useSocket() as any;
  const selectedChatIdRef = useRef<string>("");
  const { user } = useAuth();

  const handleNewMessage = useCallback((newMsg: any) => {
    console.log("🔥 receive-message in useChat:", newMsg);
    setChats((prev) =>
      prev
        .map((chat) => {
          if (chat.chatId !== String(newMsg.chatId)) return chat;
          const isCurrentlyViewing =
            selectedChatIdRef.current === String(newMsg.chatId);
          return {
            ...chat,
            lastMessageContent: newMsg.message,
            lastMessageTime: newMsg.createdAt,
            participants: chat.participants.map((p) => {
              return {
                ...p,
                unreadCount: isCurrentlyViewing
                  ? 0
                  : String(p.userId) !== String(newMsg.sender?.id)
                    ? (p.unreadCount || 0) + 1
                    : p.unreadCount,
              };
            }),
          };
        })
        .sort((a, b) => {
          const aTime = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : 0;
          const bTime = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : 0;
          return bTime - aTime;
        }),
    );
  }, []);

  const checkIsUserInChat = (
    { chatId }: { chatId: string },
    callback: (res: { userId: string; isViewing: boolean }) => void,
  ) => {
    const isUserInChat = selectedChatIdRef.current === String(chatId);
    callback({ userId: String(user?.id), isViewing: isUserInChat });
  };

  const recieveNotification = (data: Notification) => {
    setNotification((prev) => {
      return {
        ...(prev ?? {
          hasNext: false,
          count: 0,
          data: [],
        }),
        data: [...(prev?.data || []), data],
      };
    });
  };

  const newChat = (data: Chat) => {
    // console.log(data, "new chat data");
    setChats((prev) => [data, ...prev]);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", handleNewMessage);
    socket.on("check-chat", checkIsUserInChat);
    socket.on("notification", recieveNotification);
    socket.on("new-chat", newChat);
    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("check-chat", checkIsUserInChat);
      socket.off("notification", recieveNotification);
      socket.off("new-chat", newChat);
    };
  }, [socket]);

  const getChat = async (): Promise<Chat[] | null> => {
    try {
      setLoading(true);
      const res = await getChats();
      setChats(res.data);
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.response?.data?.error;
      toast.error(message);
      setChats([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      getChat();
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  }, [refresh]);

  // ✅ fetch notifications — moved from SideBar + NotificationComp
  const fetchNotifications = useCallback((limit = 10, page = 1) => {
    setNotifLoading(true);
    getNotification(limit, page)
      .then((res) => {
        setNotification({ ...res });

        setIsAllNotifRead(!res?.data?.some((n) => !n.isRead));
        setNotifError(null);
      })
      .catch((err) => {
        console.log(err, "Error in fetching notification");
        setNotifError("Failed to load notifications");
      })
      .finally(() => setNotifLoading(false));
  }, []);

  // initial fetch (drives the unread badge) + refetch whenever notifRefresh toggles
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, notifRefresh]);

  // ✅ mark-all-read — moved from NotificationComp
  const handleMarkAllRead = async () => {
    if (!notification?.data?.length || markingAllRead) return;
    setMarkingAllRead(true);
    try {
      await markAllAsRead();
      setIsNotifOpened(false);
      setNotifRefresh((prev) => !prev);
      setNotification((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((n) => ({ ...n, isRead: true })),
            }
          : prev,
      );
      setIsAllNotifRead(true);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const onSelectedChat = async (chatId: string) => {
    if (!chatId) return;
    try {
      const users = (await getParticipantsForChat(
        chatId,
      )) as unknown as ApiResponse<User[]>;
      setParticipants(users.data as unknown as User[]);
    } catch (e: any) {
      const messsage = e?.response?.data?.message as string;
      toast.error(messsage || "Failed to fetch participants for this chat");
    }

    setSelectedChatId(chatId);
    try {
      await readChat(chatId);
      await readByChatIdNotification(chatId);

      setIsNotifOpened(false);

      // ✅ locally mark notifications belonging to this chat as read
      setNotification((prev) => {
        if (!prev) return prev;

        const updatedData = prev.data.map((n) =>
          String(n.chat.id) === String(chatId) ? { ...n, isRead: true } : n,
        );

        // ✅ update bell indicator
        setIsAllNotifRead(!updatedData.some((n) => !n.isRead));

        return {
          ...prev,
          data: updatedData,
        };
      });
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
                p.userId ===
                chat.participants.find(
                  (p) => String(p.userId) === String(user?.id),
                )?.userId
                  ? { ...p, unreadCount: 0 }
                  : p,
              ),
            }
          : chat,
      ),
    );
    selectedChatIdRef.current = chatId;
  };

  // ✅ notification click — moved from NotificationComp, calls onSelectedChat internally
  // const handleNotificationClick = async (chatId: string, notificationId: string) => {
  //     try {
  //         await readNotification(notificationId);
  //     } catch (err) {
  //         console.error("Failed to mark notification as read", err);
  //     }
  //     await onSelectedChat(chatId);
  //     setIsNotifOpened(false);
  //     setNotifRefresh(prev => !prev);
  // };

  const handleNotificationClick = async (
    chatId: string,
    notificationId: string,
  ) => {
    try {
      await readNotification(notificationId);

      // ✅ mark clicked notification as read locally
      setNotification((prev) => {
        if (!prev) return prev;

        const updatedData = prev.data.map((n) =>
          String(n.id) === String(notificationId) ? { ...n, isRead: true } : n,
        );

        // ✅ remove bell dot when last unread notification is read
        setIsAllNotifRead(!updatedData.some((n) => !n.isRead));

        return {
          ...prev,
          data: updatedData,
        };
      });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }

    await onSelectedChat(chatId);

    setIsNotifOpened(false);
  };

  return {
    loading,
    getChat,
    selectedChatId,
    setSelectedChatId,
    chats,
    onSelectedChat,
    setRefresh,
    participants,
    setIsAllNotifRead,
    isAllNotifRead,
    notification,
    notifLoading,
    notifError,
    markingAllRead,
    fetchNotifications,
    handleMarkAllRead,
    handleNotificationClick,
    setIsNotifOpened,
    isNotifOpened,
  };
};
