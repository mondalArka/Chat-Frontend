import { useEffect, useRef } from "react";
import { useSocket } from "../../../socket/socket.context";
import { useAuth } from "../../../context/auth.context";
import { useMessagingSocket } from "../hooks/useMessageSocket";
import { formatTime } from "../../../utils/timeFormat";

export function Conversation({ chatId, userId }: { chatId: string; userId: string }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { socket } = useSocket();
    const { messages, messageList, addMessage, handleMessage } = useMessagingSocket(chatId);
    const { user } = useAuth();
    useEffect(() => {
        messageList();
    }, [chatId]); // fetch messages when chat changes

    useEffect(() => {
        if (!socket) return;
        console.log(socket)
        console.log("🔌 registering receive-message in Conversation", socket.id);
        socket.on("receive-message", handleMessage);
        return () => {
            socket.off("receive-message", handleMessage);
        };
    }, [socket, chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        const text = inputRef.current?.value ?? "";
        if (!text.trim()) return;
        const formData = new FormData();
        formData.append("message", text);
        formData.append("chatId", chatId);
        formData.append("type", "text");
        formData.append("senderId", String(user?.id));
        try {
            await addMessage(formData);

            if (inputRef.current) inputRef.current.value = "";
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0f1117" }}>
            {/* Top Bar */}
            <div style={{
                padding: "0 24px", height: "64px", minHeight: "64px",
                borderBottom: "1px solid #1e2235", display: "flex",
                alignItems: "center", gap: "12px", background: "#141620"
            }}>
                <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: "#3b5bdb", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "14px", fontWeight: 600, color: "#fff"
                }}>CH</div>
                <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "15px", color: "#e2e8f0" }}>Chat</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#0ca678" }}>● Online</p>
                </div>
            </div>

            {/* Messages */}
            <div
                style={{ flex: 1, padding: "24px", overflowY: "hidden", display: "flex", flexDirection: "column", gap: "4px" }}
                onMouseEnter={e => (e.currentTarget.style.overflowY = "auto")}
                onMouseLeave={e => (e.currentTarget.style.overflowY = "hidden")}
            >
                {messages.length !== 0 ? messages.map((msg, index) => {
                    const isOwn = String(msg.sender?.id) === String(userId);
                    const prevMsg = messages[index - 1];
                    const showSpacer = prevMsg && String(prevMsg.senderId) !== String(msg.senderId);
                    return (
                        <div about={msg.id} key={msg.id}>
                            {showSpacer && <div style={{ height: "12px" }} />}
                            <div style={{
                                display: "flex",
                                justifyContent: isOwn ? "flex-end" : "flex-start",
                                alignItems: "flex-end", gap: "8px"
                            }}>
                                {!isOwn && (
                                    <div style={{
                                        width: "28px", height: "28px", borderRadius: "8px",
                                        background: "#1e2235", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "11px", fontWeight: 600, color: "#94a3b8"
                                    }}>
                                        {msg.sender?.name?.slice(0, 1).toUpperCase() ?? "U"}
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: "68%", padding: "10px 14px",
                                    borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                    background: isOwn ? "#3b5bdb" : "#1e2235",
                                    color: isOwn ? "#fff" : "#c4cce0",
                                    fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word"
                                }}>
                                    {msg.message}
                                    <div style={{
                                        fontSize: "10px", marginTop: "4px",
                                        color: isOwn ? "rgba(255,255,255,0.5)" : "#4a5568",
                                        textAlign: "right"
                                    }}>
                                        {formatTime(msg.createdAt)} {/* ✅ real timestamp */}
                                        {isOwn && <span style={{ marginLeft: "4px" }}>✓✓</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) :
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ color: "#4a5568", fontSize: "14px" }}>No messages yet. Say hello! 👋</p>
                    </div>
                }
                <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div style={{
                padding: "16px 20px", borderTop: "1px solid #1e2235",
                background: "#141620", display: "flex", alignItems: "center", gap: "12px"
            }}>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*,video/*,audio/*"  // restrict to media files
                // onChange={}
                />
                <button style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#4a5568", fontSize: "20px", padding: "4px", lineHeight: 1
                }} onClick={() => fileInputRef.current?.click()}>📎</button>
                <input
                    ref={inputRef}
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={{
                        flex: 1, background: "#1e2235", border: "1px solid #252b3d",
                        borderRadius: "14px", padding: "11px 16px", color: "#e2e8f0",
                        fontSize: "14px", outline: "none", transition: "border-color 0.2s"
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#3b5bdb")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#252b3d")}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        width: "42px", height: "42px", borderRadius: "12px",
                        background: "#3b5bdb", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.15s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#2f4ac7")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#3b5bdb")}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}