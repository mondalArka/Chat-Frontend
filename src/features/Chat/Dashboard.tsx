import { useRef } from "react";
import { useAuth } from "../../context/auth.context";
import { useChat } from "./hooks/useChat";
import { Conversation } from "./layout/Coversation";
import { SideBar } from "./layout/Sidebar";

export function Dashboard() {
    const {
        chats, onSelectedChat, selectedChatId, setRefresh, participants,
        setIsAllNotifRead, isAllNotifRead,
        notification, notifLoading, notifError, markingAllRead, setIsNotifOpened, isNotifOpened,
        fetchNotifications, handleMarkAllRead, handleNotificationClick
    } = useChat();
    const cursorRef = useRef<Record<string, string>>({});
    const { user } = useAuth();

    return (
        <div style={{ display: "flex", height: "100vh", background: "#0f1117", fontFamily: "'DM Sans', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
            <SideBar
                chats={chats}
                selectedChatId={selectedChatId}
                setSelectedChat={onSelectedChat}
                onSelectedChat={onSelectedChat}
                setIsAllNotifRead={setIsAllNotifRead}
                isAllNotifRead={isAllNotifRead}
                setRefresh={setRefresh}
                setIsNotifOpened={setIsNotifOpened}
                isNotifOpened={isNotifOpened}
                notification={notification}
                notifLoading={notifLoading}
                notifError={notifError}
                markingAllRead={markingAllRead}
                fetchNotifications={fetchNotifications}
                handleMarkAllRead={handleMarkAllRead}
                handleNotificationClick={handleNotificationClick}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {selectedChatId ? (
                    <Conversation
                        key={selectedChatId}
                        chatId={selectedChatId}
                        userId={String(user?.id)}
                        participants={participants}
                        cursorRef={cursorRef}
                    />
                ) : (
                    <div style={{
                        flex: 1, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: "16px",
                        color: "#4a5568"
                    }}>
                        <div style={{
                            width: "72px", height: "72px", borderRadius: "50%",
                            background: "#1a1f2e", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "32px"
                        }}>💬</div>
                        <p style={{ fontSize: "16px", color: "#4a5568", margin: 0 }}>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}