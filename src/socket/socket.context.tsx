
import React, {  createContext, useContext, useMemo, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/auth.context';

interface SocketContextType {
    socket: Socket;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = (props: SocketProviderProps) => {
    // const [socket, setSocket] = React.useState<Socket | null>(null);
    const { children } = props;
    const { isAuthenticated, user } = useAuth();

    const socket: Socket | null = useMemo(() => {
        if (isAuthenticated && user?.id ) {
            const server = io(import.meta.env.VITE_SERVER, {
                transports: ['websocket'],
                withCredentials: true,
            });
            // setSocket(server);
            return server;
        }
        return null;
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket: socket as any }}>
            {children}
        </SocketContext.Provider>
    );
};
 