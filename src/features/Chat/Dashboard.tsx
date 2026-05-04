import { useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { useChat } from "./hooks/useChat";
import { SideBar } from "./layout/Sidebar";
import { useSocket } from "../../socket/socket.hook";

export function Dashboard() {
    const { loading, getChat, chats, onSelectedChat, selectedChatId } = useChat();
    // const { user } = useAuth();
    // const { socket, loading: socketLoding } = useSocket();
    return (
        <div>
            <SideBar
                chats={chats}
                selectedChatId={selectedChatId}
                setSelectedChat={onSelectedChat}
            />
        </div>
    )
}