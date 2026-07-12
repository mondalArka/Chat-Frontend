export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    data: T;
    message?: string;
    error?: string | string[];
}

export type SessionType = {

    sessionId: string
}

export type ChatParticipant = {
    userId: number;
    name: string;
    email: string;
    unreadCount: number;
};

export type Chat = {
    chatId: string;
    chatName: string;
    lastMessageContent: string | null;
    lastMessageTime: string | null;
    participants: ChatParticipant[];
    createdAt: Date;
    updatedAt: Date;
    chatType: string;
};

export type GetChatsResponse = {
    data: Chat[];
    message: string;
    statusCode: number;
};

export interface MessageMedia {
    id: string;
    messageId: string;
    fileName: string;
    originalName: string;
    order: number;
    size: number;
    type: string;
    mimeType?: string;
}

export interface Media {
    id: string;
    messageId: string;
    fileName: string;
    originalName: string;
    order: number;
    size: number;
    type: string;
    url?: string;
    thumbnailUrl?: string;
}

export interface Message {
    id: string;
    senderId: string;
    chatId: string;
    message: string | null;
    type: string;
    medias: MessageMedia[];
    sender?: {
        id: string;
        name: string;
        email: string;
    };
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export type NotificationParticipant = {
    chatId: string;
    user: {
        name: string;
    };
};

export type NotificationChat = {
    id: string;
    type: "one" | "group"; // adjust if there are other chat types in your app
    chatName: string;
    participants: NotificationParticipant[];
};

export type Notification = {
    id: string;
    userId: string;
    name: string;
    chat: NotificationChat;
    isRead: boolean;
    createdAt: string; // ISO date string — convert with `new Date(createdAt)` when needed
};

export type NotificationResponse = {
    data: Notification[];
    hasNext: boolean;
    count: number;
};