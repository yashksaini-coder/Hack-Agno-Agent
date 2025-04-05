import React from "react";
import { format } from "date-fns";
import { User, Terminal } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${isUser ? "bg-blue-600 ml-2" : "bg-red-600"}`}
        >
          {isUser ? <User size={16} /> : <Terminal size={16} />}
        </div>
        
        <div>
          <div
            className={`rounded-lg px-4 py-2 ${isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}
          >
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1 px-2">
            {format(new Date(message.timestamp), "h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
