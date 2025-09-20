"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import MessageList from "@/components/chat/MessageList";
import InputField from "@/components/chat/InputField";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是你的情绪小伙伴，有什么想和我聊聊的吗？ 💭",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSend = input.trim().length > 0 && !isLoading;

  const handleSend = () => {
    if (!canSend) return;
    const now = new Date();
    const userMessage: Message = {
      id: now.getTime().toString(),
      role: "user",
      content: input.trim(),
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiReplies = [
        "我理解你的感受。能多和我说说吗？我在这里听你倾诉~ 🫧",
        "听起来你今天的心情有些复杂，没关系，我在这里陪着你 💙",
        "谢谢你愿意和我分享这些，你并不孤单，我在这里支持你 ✨",
        "每个人都会有这样的时刻，重要的是你要知道，我一直在你身边 🌟",
      ];
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 900);
  };

  return (
    <AppShell title="和泡泡聊天" showBack onBack={() => router.back()}>
      <div className="flex min-h-dvh flex-col">
        {/* 消息列表 */}
        <MessageList messages={messages} isLoading={isLoading} />
        {/* 输入框 */}
        <InputField
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isRecording={false}
          startVoice={() => {}}
          stopVoice={() => {}}
          canSend={canSend}
        />
      </div>
    </AppShell>
  );
}
