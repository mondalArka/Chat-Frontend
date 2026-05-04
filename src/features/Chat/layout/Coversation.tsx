import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../../../socket/socket.hook";

type Message = {
  message: string;
  chatId: string;
  senderId?: string;
};

export function Conversation({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { socket } = useSocket();
  // 🔥 handle incoming message
  const handleMessage = useCallback((msg: Message) => {
    if (msg.chatId !== chatId) return; // ignore other chats

    setMessages((prev) => [...prev, msg]);
  }, [chatId]);

  // 🔌 socket listener
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [handleMessage]);

  // 📤 send message via HTTP (not socket)
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await fetch("/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          chatId,
        }),
      });

      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* 🧾 Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-gray-200 px-3 py-2 rounded w-fit max-w-[70%]"
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* ✏️ Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}