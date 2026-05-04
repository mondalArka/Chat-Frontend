import { getSocket } from "./config";

export const listenMessage = (cb: (data: any) => void) => {
    const socket = getSocket();
    socket?.on("receive-message", cb);
};

export const sendMessage = (data: any) => {
    const socket = getSocket();
    socket?.emit("send-message", data);
};

export const removeMessageListener = () => {
    const socket = getSocket();
    socket?.off("receive-message");
};