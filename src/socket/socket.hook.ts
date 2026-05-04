
import { useEffect, useState } from "react";
import { connectSocket } from "./config";
import type { Socket } from "socket.io-client";
import toast from "react-hot-toast";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let server: Socket | null = null;
        try {
            setLoading(true);
            server = connectSocket();

            server.on("connect", () => {
                setLoading(false);
                console.log("Socket connected:", server?.id);
            });

            server.on("connect_error", () => {
                setLoading(false);
                toast.error("Socket connection failed");
            });
            setSocket(server);
        } catch (err) {
            toast.error("Failed to connect to socket server");
            console.error(err);
        }

        return () => {
            server!.disconnect();
        }
    }, [])

    return { socket, loading };
}