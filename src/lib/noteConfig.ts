import { NoteType } from './types';

// lib/noteConfig.ts
export const NOTE_CONFIG: Record<NoteType, {
  label: string;
  prompt?: string;
  cardBg: string;   // Tailwind/自定义色
  color: string;    // 标题颜色类
  icon: React.ReactNode;
  tiltDeg?: number;
  order: number;
}> = {
  goodnight:  { label: "晚安纸条",  prompt: "...", cardBg: "bg-[#CFC6FF]", color: "text-[#4B4B7A]", icon: "🌙", tiltDeg: -2 , order: 1},
  gratitude:  { label: "感恩纸条",  prompt: "...", cardBg: "bg-[#D6F1C9]", color: "text-[#3F6B3E]", icon: "🙏", tiltDeg: 2 , order: 2},
  emotion:    { label: "情绪纸条",  prompt: "...", cardBg: "bg-[#C8F0FF]", color: "text-[#2E6B78]", icon: "💭", tiltDeg: -2 , order: 3},
  reflection: { label: "思考纸条",  prompt: "...", cardBg: "bg-[#FFF0B3]", color: "text-[#856400]", icon: "🤔", tiltDeg: 2 , order: 4},
};


export const NOTE_TYPES: NoteType[] = Object.keys(NOTE_CONFIG) as NoteType[];

export const getNoteConfig = (type: NoteType) => {
  return NOTE_CONFIG[type];
};

export const getNotesByTypeOrder = (types: NoteType[] = NOTE_TYPES) => {
  return types.sort((a, b) => NOTE_CONFIG[a].order - NOTE_CONFIG[b].order);
};