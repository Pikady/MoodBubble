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

export interface ChatSession {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
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