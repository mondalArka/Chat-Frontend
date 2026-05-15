import { useState } from "react";
import type { Chat } from "../../../types/response.types";
import type { SideBarProps } from "../../../types/props.types";
import { useMessage } from "../hooks/useMessage";
import { useAuth } from "../../../context/auth.context";
import toast from "react-hot-toast";
import { readChat } from "../../../api/chat.api";

export function SideBar({ chats, selectedChatId, setSelectedChat }: SideBarProps) {
    const [search, setSearch] = useState("");
    const { user } = useAuth();

    const filtered = chats?.filter((item: Chat) =>
        item?.chatName?.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name: string) =>
        name ? name.slice(0, 2).toUpperCase() : "?";

    const avatarColors = [
        "#3b5bdb", "#ae3ec9", "#0ca678", "#f03e3e",
        "#e67700", "#1971c2", "#5f3dc4"
    ];
    const getColor = (name: string) =>
        avatarColors[(name?.charCodeAt(0) ?? 0) % avatarColors.length];

    const formatTime = (isoString: string | null) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleOnSelectChat = async (chatId: string) => {
        setSelectedChat(chatId);
        try {
            await readChat(chatId);
        } catch (err) {
            toast.error("Failed to mark messages as read");
            console.error("Error marking messages as read:", err);
        }
    }

    return (
        <div style={{
            width: "320px", height: "100vh", background: "#141620",
            display: "flex", flexDirection: "column",
            borderRight: "1px solid #1e2235"
        }}>
            {/* Header */}
            <div style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid #1e2235"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ fontSize: "20px", fontWeight: 600, color: "#e2e8f0", letterSpacing: "-0.3px" }}>
                        Messages
                    </span>
                    <button style={{
                        background: "#1e2235", border: "none", borderRadius: "10px",
                        width: "34px", height: "34px", cursor: "pointer",
                        color: "#94a3b8", fontSize: "18px", display: "flex",
                        alignItems: "center", justifyContent: "center"
                    }}
                        onClick={() => { }}
                    >+</button>
                </div>

                {/* Search */}
                <div style={{ position: "relative" }}>
                    <svg style={{
                        position: "absolute", left: "12px", top: "50%",
                        transform: "translateY(-50%)", width: "15px", height: "15px"
                    }} viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search conversations..."
                        style={{
                            width: "100%", boxSizing: "border-box",
                            background: "#1e2235", border: "1px solid #252b3d",
                            borderRadius: "12px", padding: "10px 12px 10px 36px",
                            color: "#e2e8f0", fontSize: "14px", outline: "none",
                        }}
                    />
                </div>
            </div>

            {/* Chat List */}
            <div
                style={{ flex: 1, overflowY: "hidden" }}
                onMouseEnter={e => (e.currentTarget.style.overflowY = "auto")}
                onMouseLeave={e => (e.currentTarget.style.overflowY = "hidden")}
            >
                {filtered?.length === 0 && (
                    <p style={{ textAlign: "center", color: "#4a5568", fontSize: "14px", marginTop: "40px" }}>
                        No chats found
                    </p>
                )}

                {filtered?.map((item: Chat) => {
                    const isActive = selectedChatId === item.chatId;
                    const currentParticipantDetails = item.participants.find(p => p.userId === Number(user!.id));
                    const name = item.chatType === "group" ? item?.chatName || "Unknown" : item.participants.find(p => p.userId !== Number(user!.id))?.name || "Unknown";
                    return (
                        <div
                            key={item.chatId}
                            onClick={() => handleOnSelectChat(item.chatId)}
                            style={{
                                display: "flex", alignItems: "center", gap: "12px",
                                padding: "14px 20px", cursor: "pointer",
                                transition: "background 0.15s",
                                background: isActive ? "#1e2235" : "transparent",
                                borderLeft: isActive ? "3px solid #3b5bdb" : "3px solid transparent",
                                position: "relative"
                            }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.background = "#191d2b";
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.background = "transparent";
                            }}
                        >
                            {/* Avatar */}
                            <div style={{
                                width: "46px", height: "46px", borderRadius: "14px",
                                background: getColor(name), flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "15px", fontWeight: 600, color: "#fff"
                            }}>
                                {getInitials(name)}
                            </div>

                            {/* Info */}
                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                    <span style={{
                                        fontWeight: 500, fontSize: "15px",
                                        color: isActive ? "#e2e8f0" : "#c4cce0",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                    }}>{name}</span>
                                    <span style={{ fontSize: "11px", color: "#4a5568", flexShrink: 0, marginLeft: "8px" }}>
                                        {formatTime(item.lastMessageTime)}
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{
                                        fontSize: "13px", color: "#4a5568",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                        display: "block", flex: 1, minWidth: 0
                                    }}>
                                        {item?.lastMessageContent || "No messages yet"}
                                    </span>
                                    {currentParticipantDetails!.unreadCount > 0 && (
                                        <div style={{
                                            flexShrink: 0, marginLeft: "8px",
                                            minWidth: "20px", height: "20px",
                                            borderRadius: "10px", background: "#0ca678",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "11px", fontWeight: 700, color: "#fff",
                                            padding: "0 5px"
                                        }}>
                                            {currentParticipantDetails!.unreadCount > 99 ? "99+" : currentParticipantDetails!.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{
                padding: "14px 20px", borderTop: "1px solid #1e2235",
                display: "flex", alignItems: "center", gap: "10px"
            }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "#3b5bdb", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "#fff"
                }}>Me</div>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>My Account</span>
                <div style={{
                    marginLeft: "auto", width: "8px", height: "8px",
                    borderRadius: "50%", background: "#0ca678"
                }} />
            </div>
        </div>
    );
}