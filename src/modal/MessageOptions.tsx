import { useRef, useState } from "react";

export default function MessageOptions(
    {
        data,
        setReplyTo
    }: {
        data: { keyName: string, messageId: string }[],
        setReplyTo: React.Dispatch<React.SetStateAction<string>>
    }) {
    const [optionSelected, setOptionSelected] = useState<string>("");
    const divRef = useRef<HTMLDivElement | null>(null);

    const onSelected = (e: React.MouseEvent<HTMLButtonElement>) => {
        const messageId = e.currentTarget.dataset.messageid;
        const keyName = e.currentTarget.dataset.keyname;

        switch (keyName) {
            case "Reply": {
                setOptionSelected("Reply");
                setReplyTo(messageId || "");
                break;
            }

            default: break;
        }
    }
    return (<>
        <div
            ref={divRef}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                background: "rgba(30, 34, 53, 0.95)",
                border: "1px solid #2d3748",
                padding: "6px 8px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                backdropFilter: "blur(10px)"
            }}
        >
            {data.map(({ keyName: label, messageId }) => (
                <button
                    key={messageId}
                    data-messageId={messageId}
                    data-keyname={label}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: label === "Cancel" ? "#e53e3e" : "#90cdf4",
                        fontSize: "13px",
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#2d3748")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    onClick={(e) => onSelected(e)}
                >
                    {label}
                </button>
            ))}
        </div>
    </>);
}