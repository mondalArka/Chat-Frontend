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
    id: string;
    type: string;
    chatName: string;
    lastMessage: string;
    participants: string[];
    messages: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}