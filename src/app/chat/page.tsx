"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
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
  const [sessionId] = useState(() => uuidv4()); // 生成唯一的会话ID
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是泡泡，你的情绪小伙伴，有什么想和我聊聊的吗？ 💭",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const imageBubbleChatCenter = "/images/chat/bubble_chat_center.svg";

  const canSend = input.trim().length > 0 && !isLoading;

  const handleSend = async () => {
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

    try {
      // 不预先创建空的AI消息，只显示加载动画

      let aiMessageCreated = false;
      let currentAiMessageId = (Date.now() + 1).toString();

      // 准备发送给API的消息历史
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // 调用AI聊天API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          messages: [...apiMessages, { role: 'user', content: input.trim() }],
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('请先登录后再聊天');
        }
        throw new Error('AI服务暂时不可用');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  aiResponse += parsed.content;

                  // 如果是第一次收到内容，创建AI消息
                  if (!aiMessageCreated) {
                    const aiMessage: Message = {
                      id: currentAiMessageId,
                      role: "assistant",
                      content: aiResponse,
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, aiMessage]);
                    aiMessageCreated = true;
                  } else {
                    // 更新现有AI消息内容
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === currentAiMessageId
                          ? { ...msg, content: aiResponse }
                          : msg
                      )
                    );
                  }
                }
                if (parsed.done) {
                  setIsLoading(false);
                  return;
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('AI回复失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error instanceof Error && error.message === '请先登录后再聊天'
          ? "请先登录后再和我聊天哦~ 💭"
          : "抱歉，我现在无法回复。请稍后再试吧~ 🫧",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell title="和泡泡聊天" showBack onBack={() => router.back()}>
      <div className="relative p-4 space-y-4 flex flex-col max-h-[calc(100vh-200px)]">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto" style={{ zIndex: 1400 }}>
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      </div>

      {/* 输入框 */}
      <InputField
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isRecording={false}
        startVoice={() => { }}
        stopVoice={() => { }}
        canSend={canSend}
      />

      {/* 泡泡 */}
      <div className="absolute bottom-0 w-[100%] z-0" style={{ "zIndex": 0}}>
        <img src={imageBubbleChatCenter} className="w-[100%] mx-[auto]" alt="" />
      </div>
    </AppShell>
  );
}
