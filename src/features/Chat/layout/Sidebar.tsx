import type { SideBarProps } from "../../../types/props.types";

export function SideBar({
    chats,
    selectedChatId,
    setSelectedChat
}: SideBarProps) {

    return (
        <div className="w-[320px] h-screen bg-white border-r shadow-md flex flex-col">

            {/* Header */}
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Chats</h2>
            </div>

            {/* Search */}
            <div className="p-3 border-b">
                <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">

                {chats?.map((item: any) => {
                    const isActive = selectedChatId === item.chat_id;

                    return (
                        <div
                            key={item.chat_id}
                            onClick={() => setSelectedChat(item.chat_id)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b transition
                                ${isActive
                                    ? "bg-green-100 border-l-4 border-green-500"
                                    : "hover:bg-gray-100"}
                            `}
                        >
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                                {item?.chat_chatName || "?"}
                            </div>

                            {/* Chat Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium truncate">
                                        {item?.chat_chatName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        2:45 PM
                                    </span>
                                </div>

                                <div className="text-sm text-gray-500 truncate">
                                    {item?.lastMessage_message || "No messages yet"}
                                </div>
                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}