import type { Dispatch, SetStateAction } from "react";
import type { Chat } from "./response.types";

export type OTPProps = {
    length?: number;
}

export type SideBarProps = {
    chats: Chat[];
    selectedChatId: string;
    setSelectedChat: (chatId: string) => void;
    setRefresh: Dispatch<SetStateAction<boolean>>;
}