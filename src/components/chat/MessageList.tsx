// components/MessageList.tsx
import React from "react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-[140px] space-y-6">
      <motion.div className="space-y-6">
        {messages.map((m, index) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-end gap-3 max-w-[85%]">
              {/* 消息气泡 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={[
                  "relative px-4 py-3 text-[15px] leading-6 rounded-3xl shadow-lg",
                  m.role === "user"
                    ? "bg-white text-black rounded-br-none"
                    : "bg-black text-white rounded-bl-none",
                ].join(" ")}
                style={{
                  boxShadow: m.role === "user"
                    ? "0 4px 20px rgba(92, 95, 95, 0.3)"
                    : "0 4px 20px rgba(201, 194, 194, 0.73)",
                }}
              >
                {m.content}
              </motion.div>
            </div>
          </motion.div>
        ))}


      </motion.div>
    </div>
  );
};

export default MessageList;
