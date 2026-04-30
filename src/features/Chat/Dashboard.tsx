import { useAuth } from "../../context/auth.context";
import { useChat } from "./hooks/useChat";
import { SideBar } from "./layout/Sidebar";

export function Dashboard() {
    const { loading, getChat, chats, onSelectedChat, selectedChatId } = useChat();
    const { user } = useAuth();
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