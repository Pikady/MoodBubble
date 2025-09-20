// lib/noteConfig.ts
import type React from 'react';
import { NoteType } from './types';

type NoteUiConfig = {
  label: string;
  prompt?: string;
  cardBg: string;     // 卡片前景底色或渐变
  ribbonBg: string;   // NEW: 背后“溢出色带”底色或渐变
  color: string;      // 标题/文字颜色类（保留你的字段）
  icon: React.ReactNode | string;
  tiltDeg?: number;
  order: number;
};

export const NOTE_CONFIG: Record<NoteType, NoteUiConfig> = {
  goodnight: {
    label: '晚安纸条',
    prompt: '今天过得怎么样？让我更了解你一些吧～',
    // 可以用纯色，也可以直接用渐变：
    cardBg: 'bg-[#CFC6FF]',                             // 前景卡片
    ribbonBg: 'bg-[#BDB2FF]/70',                        // NEW: 背后横带
    color: 'text-[#4B4B7A]',
    icon: '🌙',
    tiltDeg: -3,
    order: 1,
  },
  gratitude: {
    label: '感恩纸条',
    prompt: '记录你今天觉得感恩的小瞬间！',
    cardBg: 'bg-[#D6F1C9]',
    ribbonBg: 'bg-[#C4E6B4]/70',
    color: 'text-[#3F6B3E]',
    icon: '🙏',
    tiltDeg: 2,
    order: 2,
  },
  emotion: {
    label: '情绪纸条',
    prompt: '分享一下你现在的心情吧！',
    cardBg: 'bg-[#C8F0FF]',
    ribbonBg: 'bg-[#B9E6FA]/70',
    color: 'text-[#2E6B78]',
    icon: '💭',
    tiltDeg: -2,
    order: 3,
  },
  thought: {
    label: '思考纸条',
    prompt: '最近有什么值得思考的事情吗？',
    cardBg: 'bg-[#FFF0B3]',
    ribbonBg: 'bg-[#FFE58A]/70',
    color: 'text-[#856400]',
    icon: '🤔',
    tiltDeg: 2,
    order: 4,
  },
};

export const NOTE_TYPES: NoteType[] = Object.keys(NOTE_CONFIG) as NoteType[];

export const getNoteConfig = (type: NoteType) => NOTE_CONFIG[type];

export const getNotesByTypeOrder = (types: NoteType[] = NOTE_TYPES) =>
  types.sort((a, b) => NOTE_CONFIG[a].order - NOTE_CONFIG[b].order);
