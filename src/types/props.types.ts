import type { Dispatch, SetStateAction } from "react";
import type { Chat, NotificationResponse } from "./response.types";
import type { User } from "./user.types";

export type OTPProps = {
    length?: number;
}

export type SideBarProps = {
    chats: Chat[];
    selectedChatId: string;
    onSelectedChat: (chatId: string) => void;
    setSelectedChat: (chatId: string) => void;
    setRefresh: Dispatch<SetStateAction<boolean>>;
    setIsAllNotifRead: Dispatch<SetStateAction<boolean>>;
    isAllNotifRead: boolean;
    setIsNotifOpened: Dispatch<SetStateAction<boolean>>;
    isNotifOpened: boolean;

    // ✅ added — notification data/handlers now sourced from useChat via Dashboard
    notification?: NotificationResponse;
    notifLoading: boolean;
    notifError: string | null;
    markingAllRead: boolean;
    fetchNotifications: (limit?: number, page?: number) => void;
    handleMarkAllRead: () => void;
    handleNotificationClick: (chatId: string, notificationId: string) => void;
}

export type InviteProps = {
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>;
}

// ✅ NotificationComp is now purely presentational — no more onSelectChat/isAllNotifRead needed directly,
// since chat-selection now happens inside handleNotificationClick (passed down from useChat)
export type NotificationProps = InviteProps & {
    notification?: NotificationResponse;
    loading: boolean;
    error: string | null;
    markingAllRead: boolean;
    handleMarkAllRead: () => void;
    handleNotificationClick: (chatId: string, notificationId: string) => void;
};