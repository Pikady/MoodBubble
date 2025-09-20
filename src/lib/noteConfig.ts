import { NoteType } from './types';

// lib/noteConfig.ts
export const NOTE_CONFIG: Record<NoteType, {
  label: string;
  prompt?: string;
  cardBg: string;   // Tailwind/自定义色
  labelBg?: string;
  boxDefaultH?: string; // NoteBox默认高度
  boxExpandH?: string;  // NoteBox展开高度
  color: string;    // 标题颜色类
  icon: React.ReactNode;
  tiltDeg?: number;
  order: number;
}> = {
  gratitude:  { label: "感恩纸条",  prompt: "...", cardBg: "bg-[#E8F5DE]", labelBg: "bg-[#D2ECBF]", color: "text-[#3F6B3E]", boxDefaultH: '100%', boxExpandH: '100%', icon: "🙏", tiltDeg: 2 , order: 2},
  goodnight:  { label: "晚安纸条",  prompt: "...", cardBg: "bg-[#D0D5EF]", labelBg: "bg-[#B9B6FF]", color: "text-[#4B4B7A]", boxDefaultH: '300px', boxExpandH: 'calc(100%-60px)', icon: "🌙", tiltDeg: -2 , order: 1},
  reflection: { label: "思考纸条",  prompt: "...", cardBg: "bg-[#F0ECD8]", labelBg: "bg-[#FFF9B6]", color: "text-[#856400]", boxDefaultH: '240px', boxExpandH: 'calc(100%-120px)', icon: "🤔", tiltDeg: 2 , order: 4},
  emotion:    { label: "情绪纸条",  prompt: "...", cardBg: "bg-[#DBF5EB]", labelBg: "bg-[#B8EFFB]", color: "text-[#2E6B78]", boxDefaultH: '180px', boxExpandH: 'calc(100%-180px)', icon: "💭", tiltDeg: -2 , order: 3},
};


export const NOTE_TYPES: NoteType[] = Object.keys(NOTE_CONFIG) as NoteType[];

export const getNoteConfig = (type: NoteType) => {
  return NOTE_CONFIG[type];
};

export const getNotesByTypeOrder = (types: NoteType[] = NOTE_TYPES) => {
  return types.sort((a, b) => NOTE_CONFIG[a].order - NOTE_CONFIG[b].order);
};