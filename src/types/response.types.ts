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

export type Chat = {
    chat_id: string;
    chat_type: string;
    participants_chatId: string;
    participants_userId: string;
    participants_unreadCount: number;
    participants_joinedAt: Date;
    lastMessage_id: string;
    lastMessage_senderId: string;
    lastMessage_message: string;
    lastMessage_type: string;
    lastMessage_createdAt: Date;
    lastMessage_updatedAt: Date;
    lastMessage_deletedAt: Date;
    chat_chatName: string;
    chat_createdAt: Date;
    chat_updatedAt: Date;
    chat_deletedAt: Date;
}

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
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}