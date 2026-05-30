import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../socket/socket.context";
import { useAuth } from "../../../context/auth.context";
import { useMessagingSocket } from "../hooks/useMessageSocket";
import { formatTime } from "../../../utils/timeFormat";
import toast from "react-hot-toast";
import { API_URL } from "../../../api/config";
import MessageOptions from "../../../modal/MessageOptions";
import type { User } from "../../../types/user.types";

export function Conversation({ chatId, userId, participants }: { chatId: string; userId: string, participants: User[] }) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [hoverMessageId, setHoverMessageId] = useState<string | null>(null);
    const [replyTo, setReplyTo] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { socket } = useSocket();
    const { messages, messageList, addMessage, handleMessage } = useMessagingSocket(chatId);
    const { user } = useAuth();

    useEffect(() => { messageList(); }, [chatId]);

    useEffect(() => {
        if (!socket) return;
        socket.on("receive-message", handleMessage);
        return () => { socket.off("receive-message", handleMessage); };
    }, [socket, chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onRowEnter = (id: string) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHoverMessageId(id);
    };

    const onRowLeave = () => {
        hoverTimeout.current = setTimeout(() => setHoverMessageId(null), 200);
    };

    const onPopupEnter = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };

    const onPopupLeave = () => {
        hoverTimeout.current = setTimeout(() => setHoverMessageId(null), 200);
    };

    const sendMessage = async () => {
        const text = inputRef.current?.value ?? "";
        if (!text.trim() && selectedFiles.length === 0) return;
        const formData = new FormData();
        formData.append("message", text);
        formData.append("chatId", chatId);
        formData.append("senderId", String(user?.id));
        selectedFiles.forEach(file => formData.append("docs", file));

        if (replyTo) formData.append("replyToMessageId", replyTo);

        if (selectedFiles.length > 0 && text.length > 0)
            formData.append("type", "mixed");
        else if (selectedFiles.length > 0 && text.length === 0)
            formData.append("type", "media");
        else if (selectedFiles.length === 0 && text.length > 0)
            formData.append("type", "text");
        else {
            toast.error("You can't send an empty message");
            return;
        };

        try {
            await addMessage(formData);
            setSelectedFiles([]);
            setPreviewUrls([]);
            setReplyTo("");
            if (inputRef.current) inputRef.current.value = "";
        } catch (err) {
            console.error("Failed to send message", err);
            toast.error("Failed to send message");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        if (files.length + selectedFiles.length > 5) {
            toast.error("You can only upload 5 files at a time");
            return;
        }
        files = files.filter(f => {
            if (f.size > 2 * 1024 * 1024) { toast.error(`${f.name} exceeds 2MB`); return false; }
            return true;
        });
        setSelectedFiles(prev => [...prev, ...files]);
        setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const S = {
        root: { display: "flex", flexDirection: "column" as const, height: "100vh", background: "#0f1117", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        topbar: { display: "flex", alignItems: "center", gap: 12, padding: "0 24px", height: 64, minHeight: 64, background: "#141620", borderBottom: "1px solid #1e2235", flexShrink: 0 },
        topbarAvatar: { width: 40, height: 40, borderRadius: 12, background: "#3b5bdb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#fff", flexShrink: 0 },
        topbarName: { margin: 0, fontWeight: 500, fontSize: 15, color: "#e2e8f0" },
        topbarStatus: { margin: 0, fontSize: 12, color: "#0ca678" },
        messages: { flex: 1, padding: "20px 24px", overflowY: "auto" as const, display: "flex", flexDirection: "column" as const, gap: 4, scrollbarWidth: "thin" as const, scrollbarColor: "#2d3748 transparent" },
        msgSpacer: { height: 12 },
        msgRow: (isOwn: boolean) => ({ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: isOwn ? "flex-end" : "flex-start" } as const),
        senderAvatar: { width: 28, height: 28, borderRadius: 8, background: "#1e2235", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#94a3b8" },
        msgWrapper: { position: "relative" as const, maxWidth: "68%", display: "flex", flexDirection: "column" as const },
        replyPopup: { position: "absolute" as const, bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", zIndex: 100 },
        bubble: (isOwn: boolean) => ({ padding: "10px 14px", fontSize: 14, lineHeight: 1.5, wordBreak: "break-word" as const, color: isOwn ? "#fff" : "#c4cce0", background: isOwn ? "#3b5bdb" : "#1e2235", borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px" }),
        mediaGrid: (hasText: boolean) => ({ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: hasText ? 8 : 0 }),
        mediaImg: { width: 180, height: 180, objectFit: "cover" as const, borderRadius: 10, cursor: "pointer", display: "block" },
        mediaVideo: { width: 200, borderRadius: 10, display: "block" },
        mediaFile: { display: "flex", alignItems: "center", gap: 6, color: "#90cdf4", fontSize: 13, textDecoration: "none" },
        msgMeta: (isOwn: boolean) => ({ fontSize: 10, marginTop: 4, textAlign: "right" as const, color: isOwn ? "rgba(255,255,255,0.45)" : "#4a5568" }),
        empty: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
        emptyText: { color: "#4a5568", fontSize: 14, margin: 0 },
        previewBar: { padding: "12px 20px", background: "#141620", borderTop: "1px solid #1e2235", display: "flex", gap: 10, overflowX: "auto" as const, flexShrink: 0 },
        thumbWrap: { position: "relative" as const, flexShrink: 0 },
        thumbImg: { width: 80, height: 80, objectFit: "cover" as const, borderRadius: 10, display: "block" },
        thumbDoc: { width: 80, height: 80, background: "#1e2235", borderRadius: 10, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8", padding: 6, textAlign: "center" as const, gap: 4, boxSizing: "border-box" as const, wordBreak: "break-all" as const },
        removeBtn: { position: "absolute" as const, top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#e53e3e", border: "none", cursor: "pointer", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 },
        inputBar: { display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "#141620", borderTop: "1px solid #1e2235", flexShrink: 0 },
        attachBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#4a5568", padding: 4, lineHeight: 1, borderRadius: 8, flexShrink: 0 },
        textInput: { flex: 1, background: "#1e2235", border: "1px solid #252b3d", borderRadius: 14, padding: "11px 16px", color: "#e2e8f0", fontSize: 14, outline: "none", minWidth: 0 },
        sendBtn: { width: 42, height: 42, borderRadius: 12, background: "#3b5bdb", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    };

    return (
        <div style={S.root}>
            <div style={S.topbar}>
                <div style={S.topbarAvatar}>CH</div>
                <div>
                    <p style={S.topbarName}>Chat</p>
                    <p style={S.topbarStatus}>● Online</p>
                </div>
            </div>

            <div style={S.messages}>
                {messages.length !== 0 ? messages.map((msg, index) => {
                    const isOwn = String(msg.sender?.id) === String(userId);
                    const prevMsg = messages[index - 1];
                    const showSpacer = prevMsg && String(prevMsg.senderId) !== String(msg.senderId);
                    return (
                        <div key={msg.id}>
                            {showSpacer && <div style={S.msgSpacer} />}
                            <div
                                style={S.msgRow(isOwn)}
                                onMouseEnter={() => onRowEnter(msg.id)}
                                onMouseLeave={onRowLeave}
                            >
                                {!isOwn && (
                                    <div style={S.senderAvatar}>
                                        {msg.sender?.name?.slice(0, 1).toUpperCase() ?? "U"}
                                    </div>
                                )}
                                <div style={S.msgWrapper}>
                                    {hoverMessageId === msg.id && !isOwn && (
                                        <div
                                            style={S.replyPopup}
                                            onMouseEnter={onPopupEnter}
                                            onMouseLeave={onPopupLeave}
                                        >
                                            <MessageOptions data={[{ keyName: "Reply", messageId: msg.id }]} setReplyTo={setReplyTo} />
                                        </div>
                                    )}
                                    <div style={S.bubble(isOwn)}>
                                        {msg.medias && msg.medias.length > 0 && (
                                            <div style={S.mediaGrid(!!msg.message)}>
                                                {msg.medias.map((media: any, i: number) => {
                                                    const fileUrl = `${API_URL.serverUrl}/uploads/${media.fileName}`;
                                                    return media.type === "image" ? (
                                                        <img key={i} src={fileUrl} alt={media.originalName} style={S.mediaImg} onClick={() => window.open(fileUrl, "_blank")} />
                                                    ) : media.type === "video" ? (
                                                        <video key={i} src={fileUrl} controls style={S.mediaVideo} />
                                                    ) : (
                                                        <a key={i} href={fileUrl} target="_blank" rel="noreferrer" style={S.mediaFile}>
                                                            📎 {media.originalName}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {msg.replyToMessage && (() => {
                                            const replied = msg?.replyToMessage;
                                            if (!replied) return null;
                                            return (
                                                <div style={{
                                                    marginBottom: 6,
                                                    padding: "6px 10px",
                                                    borderRadius: 8,
                                                    borderLeft: "3px solid rgba(255,255,255,0.3)",
                                                    background: isOwn ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.07)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 4,
                                                    cursor: "pointer",
                                                }}>
                                                    {replied.medias?.length > 0 && (
                                                        <div style={{ display: "flex", gap: 3 }}>
                                                            {replied.medias.slice(0, 3).map((media: any, i: number) => {
                                                                const fileUrl = `${API_URL.serverUrl}/uploads/${media.fileName}`;
                                                                return media.type === "image" ? (
                                                                    <img key={i} src={fileUrl} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 5 }} />
                                                                ) : media.type === "video" ? (
                                                                    <div key={i} style={{ width: 40, height: 40, borderRadius: 5, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
                                                                ) : (
                                                                    <div key={i} style={{ width: 40, height: 40, borderRadius: 5, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📎</div>
                                                                );
                                                            })}
                                                            {replied.medias.length > 3 && (
                                                                <div style={{ width: 40, height: 40, borderRadius: 5, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                                                                    +{replied.medias.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {replied.message && (
                                                        <span style={{ fontSize: 12, color: isOwn ? "rgba(255,255,255,0.6)" : "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                                                            {replied.message}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                        {msg.message && <span>{msg.message}</span>}
                                        <div style={S.msgMeta(isOwn)}>
                                            {formatTime(msg.createdAt)}
                                            {isOwn && <span style={{ marginLeft: 4 }}>✓✓</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div style={S.empty}>
                        <p style={S.emptyText}>No messages yet. Say hello! 👋</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {replyTo && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 20px",
                    background: "#141620",
                    borderTop: "1px solid #1e2235",
                    borderLeft: "3px solid #3b5bdb",
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {(() => {
                            const msg = messages.find(m => String(m.id) === String(replyTo));
                            if (!msg) return null;
                            return (
                                <>
                                    {msg.medias?.length > 0 && (
                                        <div style={{ display: "flex", gap: 4 }}>
                                            {msg.medias.slice(0, 3).map((media: any, i: number) => {
                                                const fileUrl = `${API_URL.serverUrl}/uploads/${media.fileName}`;
                                                return media.type === "image" ? (
                                                    <img key={i} src={fileUrl} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
                                                ) : media.type === "video" ? (
                                                    <div key={i} style={{ width: 36, height: 36, borderRadius: 6, background: "#1e2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
                                                ) : (
                                                    <div key={i} style={{ width: 36, height: 36, borderRadius: 6, background: "#1e2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📎</div>
                                                );
                                            })}
                                            {msg.medias.length > 3 && (
                                                <div style={{ width: 36, height: 36, borderRadius: 6, background: "#1e2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>
                                                    +{msg.medias.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {msg.message && (
                                        <span style={{ fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                                            {msg.message}
                                        </span>
                                    )}
                                    {!msg.message && !msg.medias?.length && <span style={{ fontSize: 12, color: "#94a3b8" }}>Message</span>}
                                </>
                            );
                        })()}
                    </div>
                    <button
                        onClick={() => setReplyTo("")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#4a5568", fontSize: 16, padding: 4, lineHeight: 1 }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {selectedFiles.length > 0 && (
                <div style={S.previewBar}>
                    {selectedFiles.map((file, index) => (
                        <div key={index} style={S.thumbWrap}>
                            {file.type.startsWith("image/") ? (
                                <img src={previewUrls[index]} style={S.thumbImg} alt={file.name} />
                            ) : (
                                <div style={S.thumbDoc}>
                                    📎<span>{file.name.slice(0, 12)}…</span>
                                </div>
                            )}
                            <button
                                style={S.removeBtn}
                                onClick={() => {
                                    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                                }}
                                aria-label="Remove file"
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}

            <div style={S.inputBar}>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*,video/*,audio/*" onChange={handleFileChange} multiple />
                <button style={S.attachBtn} onClick={() => fileInputRef.current?.click()} aria-label="Attach file">📎</button>
                <input
                    ref={inputRef}
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={S.textInput}
                    onFocus={e => (e.currentTarget.style.borderColor = "#3b5bdb")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#252b3d")}
                />
                <button
                    style={S.sendBtn}
                    onClick={sendMessage}
                    onMouseEnter={e => (e.currentTarget.style.background = "#2f4ac7")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#3b5bdb")}
                    aria-label="Send message"
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