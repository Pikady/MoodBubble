export type NoteType = 'goodnight' | 'gratitude' | 'emotion' | 'reflection';

export interface Note {
  id: string;
  user_id: string;
  type: NoteType;
  content: string;
  ai_reply?: string;
  ai_model?: string;
  ai_latency_ms?: number;
  tokens_input?: number;
  tokens_output?: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  session_id?: string;
  created_at: string;
}

export interface CreateNoteParams {
  type: NoteType;
  content: string;
}

export interface CreateNoteResult {
  id: string;
  ai_reply: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatRequest {
  messages: AIChatMessage[];
  model?: string;
}

export const NOTE_CONFIG: Record<NoteType, {
  label: string;
  prompt?: string;
  cardBg: string;     // 主卡片底色
  ribbonBg: string;   // 背后溢出色带
  tilt: number;       // 倾斜角度
}> = {
  goodnight: {
    label: "晚安纸条",
    prompt: "今天过得怎么样？让我更了解你一些吧～",
    cardBg: "bg-[#CFC6FF]",
    ribbonBg: "bg-[#BDB2FF]/70",
    tilt: -3,
  },
  gratitude: {
    label: "感恩纸条",
    prompt: "记录你今天觉得感恩的小瞬间！",
    cardBg: "bg-[#D6F1C9]",
    ribbonBg: "bg-[#C4E6B4]/70",
    tilt: 2,
  },
  emotion: {
    label: "情绪纸条",
    prompt: "分享一下你现在的心情吧！",
    cardBg: "bg-[#C8F0FF]",
    ribbonBg: "bg-[#B9E6FA]/70",
    tilt: -2,
  },
  reflection: {
    label: "思考纸条",
    prompt: "最近有什么值得思考的事情吗？",
    cardBg: "bg-[#FFF0B3]",
    ribbonBg: "bg-[#FFE58A]/70",
    tilt: 2,
  },
};
