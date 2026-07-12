import type { NotificationResponse } from "../types/response.types";

type NotificationCompProps = {
    isOpened: boolean;
    setIsOpened: (val: boolean) => void;
    notification?: NotificationResponse;
    loading: boolean;
    error: string | null;
    markingAllRead: boolean;
    handleMarkAllRead: () => void;
    handleNotificationClick: (chatId: string, notificationId: string) => void;
};

export const NotificationComp = ({
    isOpened, setIsOpened, notification, loading, error,
    markingAllRead, handleMarkAllRead, handleNotificationClick
}: NotificationCompProps) => {

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : "?";

    const avatarColors = ["#3b5bdb", "#ae3ec9", "#0ca678", "#f03e3e", "#e67700", "#1971c2", "#5f3dc4"];
    const getColor = (name: string) => avatarColors[(name?.charCodeAt(0) ?? 0) % avatarColors.length];

    const hasUnread = notification?.data?.some(n => !n.isRead);

    if (!isOpened) return null;

    return (
        <>
            <div
                onClick={() => setIsOpened(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
            />

            <div
                style={{
                    position: "absolute",
                    top: "64px",
                    left: "20px",
                    width: "360px",
                    maxHeight: "480px",
                    background: "#141620",
                    border: "1px solid #1e2235",
                    borderRadius: "14px",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
                    color: "#e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 50,
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 18px",
                        borderBottom: "1px solid #1e2235",
                        gap: "8px",
                    }}
                >
                    <span style={{ fontSize: "15px", fontWeight: 600, flexShrink: 0 }}>
                        Notifications
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {hasUnread && (
                            <button
                                onClick={handleMarkAllRead}
                                disabled={markingAllRead}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#3b82f6",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    cursor: markingAllRead ? "default" : "pointer",
                                    opacity: markingAllRead ? 0.5 : 1,
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    transition: "background 0.15s",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={e => !markingAllRead && (e.currentTarget.style.background = "#1e2235")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                {markingAllRead ? "Marking..." : "Mark all read"}
                            </button>
                        )}

                        <button
                            onClick={() => setIsOpened(false)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#64748b",
                                fontSize: "18px",
                                cursor: "pointer",
                                lineHeight: 1,
                                padding: "2px 4px",
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* List */}
                <div style={{ overflowY: "auto", flex: 1 }}>
                    {loading && (
                        <p style={{ textAlign: "center", color: "#4a5568", fontSize: "13px", padding: "32px 16px" }}>
                            Loading...
                        </p>
                    )}

                    {!loading && error && (
                        <p style={{ textAlign: "center", color: "#fa5252", fontSize: "13px", padding: "32px 16px" }}>
                            {error}
                        </p>
                    )}

                    {!loading && !error && notification?.data?.length === 0 && (
                        <p style={{ textAlign: "center", color: "#4a5568", fontSize: "13px", padding: "32px 16px" }}>
                            No notifications yet
                        </p>
                    )}

                    {!loading && !error && notification?.data.map((item) => {
                        const chatName = item.chat.type === "one"
                            ? item.chat.participants[0]?.user?.name || "Unknown"
                            : item.chat.chatName || "Group";

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleNotificationClick(item?.chat?.id, item?.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    padding: "12px 18px",
                                    borderBottom: "1px solid #1a1e2e",
                                    background: !item.isRead ? "#171b2a" : "transparent",
                                    cursor: "pointer",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#1e2235")}
                                onMouseLeave={e => (e.currentTarget.style.background = !item.isRead ? "#171b2a" : "transparent")}
                            >
                                <div style={{
                                    width: "34px", height: "34px", borderRadius: "10px",
                                    background: getColor(chatName), flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "12px", fontWeight: 600, color: "#fff",
                                }}>
                                    {getInitials(chatName)}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        margin: 0,
                                        fontSize: "13px",
                                        fontWeight: !item.isRead ? 600 : 400,
                                        color: !item.isRead ? "#e2e8f0" : "#94a3b8",
                                        lineHeight: 1.4,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}>
                                        {item.name}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                                        <span style={{ fontSize: "11px", color: "#4a5568" }}>
                                            {chatName}
                                        </span>
                                        <span style={{ fontSize: "11px", color: "#2f3548" }}>•</span>
                                        <span style={{ fontSize: "11px", color: "#4a5568" }}>
                                            {formatTime(item.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {!item.isRead && (
                                    <div style={{
                                        width: "7px", height: "7px",
                                        borderRadius: "50%",
                                        background: "#3b5bdb",
                                        flexShrink: 0,
                                        marginTop: "5px",
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};