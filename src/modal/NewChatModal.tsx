import { useEffect, useRef, useState } from "react"
import { userUserData } from "../hooks/useUserHook";
import toast from "react-hot-toast";
import { createChat } from "../api/chat.api";
import { useAuth } from "../context/auth.context";

export default function NewChatModal({ dialogRef, setRefresh }: any) {
    const [chatType, setChatType] = useState<"one" | "group">("one");
    const [selectedUsers, setSelectedUsers] = useState<{ id: string; name: string }[]>([]);
    const [refreshUser, setRefreshUser] = useState<boolean>(false);
    const chatNameRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { getUserData, userData, loading: userLoading } = userUserData();
    const { user } = useAuth();

    useEffect(() => {
        getUserData();
    }, [refreshUser]);

    const handleChatTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChatType(e.target.value as any);
        setSelectedUsers([]);
    };

    const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (chatType === "group") {
            const selected = Array.from(e.target.selectedOptions).map(opt => ({
                id: opt.value,
                name: opt.text,
            }));
            setSelectedUsers(selected);
        } else {
            const opt = e.target.selectedOptions[0];
            setSelectedUsers(opt ? [{ id: opt.value, name: opt.text }] : []);
        }
    };

    const removeUser = (id: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== id));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (selectedUsers.length === 0) {
            toast.error("Please select at least one participant");
            return;
        }

        if (chatType === "group" && !chatNameRef?.current?.value.trim()) {
            toast.error("Please enter a group chat name");
            return;
        }
        setLoading(true);
        const participants = selectedUsers.map(u => u.id);
        const payload = {
            type: chatType,
            participants: [String(user?.id), ...participants],
            ...(chatType === "group" ? { chatName: chatNameRef?.current?.value.trim() } : { chatName: selectedUsers[0].name }),
        };

        try {
            await createChat(payload);
            setRefresh((prev: boolean) => !prev);
            toast.success("Conversation created");
            dialogRef.current?.close();
        } catch (err: any) {
            const message = err?.response?.data.message;
            console.log(err, "message")
            toast.error(message || "Something went wrong");
        } finally {
            setLoading(false);
            setChatType("one");
            setSelectedUsers([]);
            if (chatNameRef.current)
                chatNameRef.current.value = "";

        }
    }

    return (
        <>
            <style>{`
                dialog::backdrop { background: rgba(0, 0, 0, 0.7); }
                .participant-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #252b3d;
                    border: 1px solid #2e3550;
                    border-radius: 8px;
                    padding: 4px 10px;
                    font-size: 13px;
                    color: #a5b4fc;
                }
                .participant-tag button {
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0;
                    font-size: 15px;
                    line-height: 1;
                    display: flex;
                    align-items: center;
                }
                .participant-tag button:hover { color: #e2e8f0; }
                .select-styled {
                    background: #1e2235;
                    border: 1px solid #252b3d;
                    border-radius: 12px;
                    padding: 10px 12px;
                    color: #e2e8f0;
                    font-size: 14px;
                    outline: none;
                    cursor: pointer;
                    width: 100%;
                }
                .select-styled option { background: #1e2235; color: #e2e8f0; }
            `}</style>
            <dialog
                ref={dialogRef}
                onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}
                style={{
                    border: "none", borderRadius: "16px", padding: 0,
                    background: "transparent", width: "500px", minHeight: "400px",
                    position: "fixed", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div style={{
                    background: "#141620", border: "1px solid #1e2235", borderRadius: "16px",
                    padding: "36px", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
                    minHeight: "400px", display: "flex", flexDirection: "column", gap: "20px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: "18px", fontWeight: 600, margin: 0, color: "#e2e8f0" }}>
                            New Conversation
                        </p>
                        <button
                            type="button"
                            onClick={() => dialogRef.current?.close()}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#4a5568",
                                fontSize: "20px",
                                cursor: "pointer",
                                lineHeight: 1,
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#4a5568")}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {/* Chat type */}
                        <select
                            name="type"
                            className="select-styled"
                            value={chatType}
                            onChange={handleChatTypeChange}
                        >
                            <option value="one">Single Chat</option>
                            <option value="group">Group Chat</option>
                        </select>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={() => setRefreshUser((prev: boolean) => !prev)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    // color: "#4a5568",
                                    // fontSize: "18px",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    color: "#4a5568",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#4a5568")}
                                title="Refresh users"
                            >
                                ↻ Refresh
                            </button>
                        </div>

                        {/* Participants select */}
                        <select
                            name="participants"
                            className="select-styled"
                            multiple={chatType === "group"}
                            value={chatType === "group" ? selectedUsers.map(u => u.id) : selectedUsers[0]?.id ?? ""}
                            onChange={handleUserSelect}
                            disabled={userLoading}
                            style={{ height: chatType === "group" ? "130px" : "auto" }}
                        >
                            {chatType !== "group" && (
                                <option value="" disabled>Select a user...</option>
                            )}
                            {userData.length > 0 ? (
                                userData.map((user: any) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))
                            ) : (
                                <option disabled>No users available</option>
                            )}
                        </select>

                        {/* Selected participants tags */}
                        {selectedUsers.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {selectedUsers.map(user => (
                                    <span key={user.id} className="participant-tag">
                                        {user.name}
                                        <button
                                            type="button"
                                            onClick={() => removeUser(user.id)}
                                            aria-label={`Remove ${user.name}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Group chat name */}
                        {chatType === "group" && (
                            <input
                                type="text"
                                ref={chatNameRef}
                                placeholder="Type in chat name..."
                                required
                                style={{
                                    background: "#1e2235", border: "1px solid #252b3d",
                                    borderRadius: "12px", padding: "10px 12px",
                                    color: "#e2e8f0", fontSize: "14px", outline: "none", width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                            <button
                                type="button"
                                onClick={() => dialogRef.current?.close()}
                                style={{
                                    flex: 1, background: "#1e2235", border: "1px solid #252b3d",
                                    borderRadius: "12px", padding: "10px", color: "#94a3b8",
                                    fontSize: "14px", cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || userLoading || selectedUsers.length === 0}
                                style={{
                                    flex: 1, background: "#3b5bdb", border: "none",
                                    borderRadius: "12px", padding: "10px", color: "#fff",
                                    fontSize: "14px", fontWeight: 600,
                                    opacity: loading || userLoading || selectedUsers.length === 0 ? 0.6 : 1, // ✅ add this
                                    cursor: loading || userLoading || selectedUsers.length === 0 ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? "Starting..." : "Start Conversation"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}