"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TiltedNoteInput from "@/components/notes/TiltedNoteInput";
import { NOTE_CONFIG } from "@/lib/noteConfig";
import { NoteType } from "@/lib/types";
import CharacterBubble from '@/components/mascot/CharacterBubble';

export default function WriteNotePage() {
  const router = useRouter();
  const params = useParams<{ type?: string }>();
  const type = (params?.type ?? "goodnight") as NoteType;
  const cfg = NOTE_CONFIG[type];

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const { createNote } = await import('@/app/actions/notes');
      const result = await createNote({
        type,
        content: content.trim()
      });

      setIsLoading(false);
      router.push(`/notes?highlight=${result.id}`);
    } catch (error) {
      console.error('保存笔记失败:', error);
      setIsLoading(false);
      // 可以添加错误提示
    }
  };

  return (
    <AppShell title={`写${cfg.label}`} showBack onBack={() => router.back()}>

      {/* 吉祥物占位 */}
      <div className="px-4 pt-0 pb-4" style={{ position: 'relative', top: '-25px' }}>
        <div className="flex justify-left mb-6">
          <CharacterBubble
            mood="watching"
            size={150}
            className="opacity-80"
          />
        </div>
      </div>



      {/* 让整个输入区域整体向下移动，比如加上 marginTop */}
      <div className="min-h-dvh flex flex-col" style={{ marginTop: '130px' }}>
        <div className="px-4 pt-4">
          <TiltedNoteInput
            label={cfg.label}
            placeholder={cfg.prompt || "今天过得怎么样？让我更了解你一些吧～"}
            value={content}
            onChange={setContent}
            onSubmit={handleSubmit}
            bgClass={cfg.cardBg}
            accentClass={(cfg as any).ribbonBg ?? "bg-[#BDB2FF]/65"}
            tilt={cfg.tiltDeg ?? -7}
            autoFocus
            disabled={isLoading}
          />
        </div>
        <div className="px-4 mt-6 text-xs text-black/40">{content.length} 字</div>
        {/* 下面可留白，保持图2那种上重下轻的构图 */}
        {/* <div className="flex-1" /> */}
      </div>
    </AppShell>
  );
}
