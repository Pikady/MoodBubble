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
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-none"
                    : "bg-white/90 supports-[backdrop-filter]:backdrop-blur-md border border-white/20 rounded-bl-none shadow-xl",
                ].join(" ")}
                style={{
                  boxShadow: m.role === "user"
                    ? "0 4px 20px rgba(59,130,246,0.3)"
                    : "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                {m.content}
              </motion.div>
            </div>
          </motion.div>
        ))}
        {/* 加载动画 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-end gap-3 max-w-[60%]">
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {/* Loading animation */}
              </motion.div>
              <div className="bg-white/90 supports-[backdrop-filter]:backdrop-blur-md border border-white/20 rounded-3xl rounded-bl-none px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MessageList;
