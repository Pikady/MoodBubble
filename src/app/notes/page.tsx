"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { NOTE_CONFIG } from "@/lib/types";
import { NoteType } from "@/lib/types";
import PromptCard from "@/components/notes/PromptCard";
import NoteComposer from "@/components/compose/NoteComposer";

export default function WriteNotePage({ params }: { params: Promise<{ type: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const type = resolvedParams.type as NoteType;
  const config = NOTE_CONFIG[type];
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!config) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">纸条类型不存在</h1>
            <button
              onClick={() => router.push("/notes/new")}
              className="underline"
            >
              返回选择
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    // 模拟提交
    setTimeout(() => {
      const noteId = Math.random().toString(36).slice(2, 11);
      setIsLoading(false);
      router.push(`/notes?highlight=${noteId}`);
    }, 1200);
  };

  return (
    <AppShell title={`写${config.label}`} showBack onBack={() => router.back()}>
      <div className="flex flex-col h-full">
        {/* 顶部提示卡片（倾斜 + 溢出） */}
        <div className="p-4">
          <PromptCard
            label={config.label}
            message={config.prompt || "在这里写下你的想法..."}
            bgClass={config.cardBg}
            accentClass={config.ribbonBg}
            tilt={config.tilt}
          />
        </div>

        {/* 写作区域（保持简洁，靠底部 Composer 提交） */}
        <div className="flex-1 p-4 pt-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里写下你的想法..."
            className="w-full h-full min-h-[180px] p-4 border border-input rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <NoteComposer
          value={content}
          onChange={setContent}
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      </div>
    </AppShell>
  );
}
