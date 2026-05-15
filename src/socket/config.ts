import { io, type Socket } from "socket.io-client";

let instance: Socket | null = null;

export const connectSocket = (): Socket => {
    if (!instance || instance.disconnected) {
        instance = io(import.meta.env.VITE_SERVER, {
            withCredentials: true,
            transports: ["polling", "websocket"],
            reconnection: true,
        });
        console.log("insss", instance);
    }
    console.log("outside", instance);
    return instance;
};

export const disconnectSocket = () => {
    if (instance) {
        instance.disconnect();
        instance = null; // ✅ reset so next connectSocket() creates fresh
    }
};

export const getSocket = () => instance;