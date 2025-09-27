"use client";

import { useRouter } from 'next/navigation';

import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import CharacterBubble from '@/components/mascot/CharacterBubble';
import { Plus, ArrowLeft, FileText } from 'lucide-react';
// app/notes/new/page.tsx

import PaperCollection from "@/components/ui/PaperCollection"; // 你已经写好的纸条盒组件

import NoteTypeCard from "@/components/notes/NoteTypeCard";
import { NoteType } from "@/lib/types";

export default function NewNotePage() {
  const router = useRouter();
  const items: { type: NoteType; title: string; href: string; ribbonBg: string; tiltDeg: number; offsetY: number }[] = [
    { type: "goodnight",  title: "晚安纸条",  href: "/notes/new/goodnight",  ribbonBg: "bg-[#CFC6FF]", tiltDeg: -5, offsetY: 0 },
    { type: "gratitude",  title: "感恩纸条",  href: "/notes/new/gratitude",  ribbonBg: "bg-[#D6F1C9]", tiltDeg:  3, offsetY: 4 },
    { type: "emotion",    title: "情绪纸条",  href: "/notes/new/emotion",    ribbonBg: "bg-[#C8F0FF]", tiltDeg: -4, offsetY: 6 },
    { type: "thought", title: "思考纸条",  href: "/notes/new/thought", ribbonBg: "bg-[#FFF0B3]", tiltDeg:  3, offsetY: 8 },
  ];
  const imgNoteLabelBack = "/images/mascot/note-background-line.svg";

  

  return (
    <AppShell
      topBar={
        <div className='flex justify-between'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { router.push('/home') }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      }
    >

      {/* 吉祥物占位 */}
      <div className="px-4 pt-0 pb-4 ml-4" style={{ position: 'relative', top: '-25px' }}>
        <div className="flex justify-left mb-6">
          <CharacterBubble
            mood="watching"
            size={150}
            className="opacity-80"
          />
        </div>
      </div>

      {/* 问句 + 纸条盒在右边 */}
      <div className="flex items-center justify-between px-4 mt-20 mb-0">
        <div className="text-[15px]">
          你想写什么类型的
          <span className="inline-block relative">
            <span className="relative z-[1400]">纸条？</span>
            <img className="absolute top-0 z-[1399]" src={imgNoteLabelBack} alt="" />
          </span>
          
        </div>
        <PaperCollection /> {/* 右侧纸条盒 */}
      </div>

      {/* 丝带列表：父容器要允许溢出；bleedPx=16 对齐上面的 px-4 */}
      <div className="px-4 pb-8 overflow-visible">
        <div className="mt-4 space-y-3 overflow-visible relative">
          {items.map((it, index) => (
            <NoteTypeCard
              key={it.type}
              index={index}
              type={it.type}
              title={it.title}
              href={it.href}
              ribbonBg={it.ribbonBg}
              tiltDeg={it.tiltDeg}
              offsetY={it.offsetY}
              bleedPx={16} // 与父容器 px-4 对齐
            />
          ))}
        </div>
      </div>

    </AppShell>
  );
}

