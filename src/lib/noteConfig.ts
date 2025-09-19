import { NoteType } from './types';

export const NOTE_CONFIG: Record<NoteType, {
  label: string;
  color: string;     // 文本/强调色（如 'text-violet-700'）
  cardBg: string;    // 卡片底色（如 'bg-violet-100'）
  prompt: string;    // 写纸条页顶部引导文案
  order: number;     // 分组排序
}> = {
  goodnight: {
    label: '晚安纸条',
    color: 'text-violet-700',
    cardBg: 'bg-violet-100',
    prompt: '今天过得怎么样？写点晚安心事吧~',
    order: 2
  },
  gratitude: {
    label: '感恩纸条',
    color: 'text-green-700',
    cardBg: 'bg-green-100',
    prompt: '记录你今天觉得开心/感恩的小瞬间！',
    order: 1
  },
  reflection: {
    label: '思考纸条',
    color: 'text-amber-700',
    cardBg: 'bg-amber-100',
    prompt: '今天有什么想法/反思？留给未来的你~',
    order: 3
  },
  emotion: {
    label: '情绪纸条',
    color: 'text-sky-700',
    cardBg: 'bg-sky-100',
    prompt: '你现在的感觉是什么？写下来会轻松些~',
    order: 4
  }
};

export const NOTE_TYPES: NoteType[] = Object.keys(NOTE_CONFIG) as NoteType[];

export const getNoteConfig = (type: NoteType) => {
  return NOTE_CONFIG[type];
};

export const getNotesByTypeOrder = (types: NoteType[] = NOTE_TYPES) => {
  return types.sort((a, b) => NOTE_CONFIG[a].order - NOTE_CONFIG[b].order);
};