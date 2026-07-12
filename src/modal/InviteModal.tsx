import { useState } from "react";
import type { InviteProps } from "../types/props.types";
import { inviteStrangers } from "../api/chat.api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "../context/auth.context";

export const Invite = ({ isOpened, setIsOpened }: InviteProps) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState<number>();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const canSubmit = (email.trim() !== "" || (phone && phone.toString().trim() !== "")) && !loading;
    const handleInvite = async () => {
        if (!email.trim() && !phone) return;

        setLoading(true);

        try {
            if (email) {
                await inviteStrangers(email.trim());
                setEmail("");
            } else if (phone) {
                const regex = /^91[6-9]\d{9}$/;
                if (!regex.test(phone.toString())) {
                    toast.error("Please enter a valid phone number");
                    return;
                }

                const message = `You have been invited to Etheral Chat by ${user?.name}. Please click this link to join ${import.meta.env.VITE_FRONT_URL}`;
                const whatsAppURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                window.open(whatsAppURL, "_blank");
                setPhone(undefined);
            }
            toast.success("Invitation sent");

            setIsOpened(false);
        } catch (err: unknown) {
            let message;

            if (err instanceof AxiosError) {
                message =
                    err.response?.data?.message ||
                    err.response?.data?.error;
            }

            toast.error(message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpened) return null;

    return (
        <>
            <style>{`
                dialog::backdrop {
                    background: rgba(0, 0, 0, 0.7);
                }
            `}</style>

            <dialog
                open={isOpened}
                style={{
                    border: "none",
                    borderRadius: "16px",
                    padding: 0,
                    background: "transparent",
                    width: "450px",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div
                    style={{
                        background: "#141620",
                        border: "1px solid #1e2235",
                        borderRadius: "16px",
                        padding: "32px",
                        color: "#e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: 600,
                            }}
                        >
                            Invite User
                        </h3>

                        <button
                            onClick={() => setIsOpened(false)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#64748b",
                                fontSize: "22px",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Description */}
                    <p
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#94a3b8",
                            lineHeight: 1.5,
                        }}
                    >
                        Enter the email address of the person you want to invite
                        to join the platform.
                    </p>

                    {/* Input */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        disabled={phone === undefined || phone === null ? false : true}
                        style={{
                            background: "#1e2235",
                            border: "1px solid #252b3d",
                            borderRadius: "12px",
                            padding: "12px",
                            color: "#e2e8f0",
                            fontSize: "14px",
                            outline: "none",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />

                    <input
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value as unknown as number)}
                        disabled={email === undefined || email === null || email === "" ? false : true}
                        placeholder="919076574696"
                        style={{
                            background: "#1e2235",
                            border: "1px solid #252b3d",
                            borderRadius: "12px",
                            padding: "12px",
                            color: "#e2e8f0",
                            fontSize: "14px",
                            outline: "none",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />

                    {/* Actions */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <button
                            onClick={() => setIsOpened(false)}
                            style={{
                                flex: 1,
                                background: "#1e2235",
                                border: "1px solid #252b3d",
                                borderRadius: "12px",
                                padding: "12px",
                                color: "#94a3b8",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleInvite}
                            disabled={!canSubmit}
                            style={{
                                flex: 1,
                                background: "#3b5bdb",
                                border: "none",
                                borderRadius: "12px",
                                padding: "12px",
                                color: "#fff",
                                fontWeight: 600,
                                cursor: canSubmit ? "pointer" : "not-allowed",
                                opacity: canSubmit ? 1 : 0.6,
                            }}
                        >
                            {loading ? "Inviting..." : "Send Invite"}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
};