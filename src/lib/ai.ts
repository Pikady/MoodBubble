import { NoteType } from './types';
import { NOTE_CONFIG } from './noteConfig';

interface AIReplyOptions {
  type: NoteType;
  content: string;
  model?: string;
}

export async function aiReply(options: AIReplyOptions): Promise<string> {
  const { type, content, model = 'gpt-4o-mini' } = options;

  // 根据纸条类型获取提示词模板
  const config = NOTE_CONFIG[type];
  const systemPrompt = getSystemPrompt(type);

  try {
    // 这里应该调用真实的AI API，暂时返回模拟回复
    return getMockReply(type, content);
  } catch (error) {
    console.error('AI回复失败:', error);
    return '抱歉，我现在有点累，稍后再回复你好吗？💭';
  }
}

function getSystemPrompt(type: NoteType): string {
  const prompts = {
    goodnight: '你是一个温暖的晚安伙伴，用简短温柔的话语回复用户的晚安心事，60字以内。',
    gratitude: '你是一个积极向上的伙伴，用鼓励的话语回应用户的感恩分享，60字以内。',
    emotion: '你是一个贴心的倾听者，用理解和关怀的话语回应用户的情绪表达，60字以内。',
    thought: '你是一个智慧的朋友，用深思的话语回应用户的思考和反思，60字以内。'
  };

  return prompts[type];
}

function getMockReply(type: NoteType, content: string): string {
  const replies = {
    goodnight: '晚安，愿你有个好梦~ 明天又是充满希望的一天！🌙',
    gratitude: '感恩的心真的很美好！生活中的小确幸最值得珍惜 🌟',
    emotion: '我理解你的感受。情绪的起伏是正常的，给自己一些时间和空间 💙',
    thought: '深度思考让我们成长！你的想法很有价值，继续探索吧 🤔'
  };

  return replies[type];
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatOptions {
  messages: AIChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function aiChat(options: AIChatOptions): Promise<string> {
  const { messages, model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 1000 } = options;

  try {
    // 这里应该调用真实的AI聊天API
    // 现在返回模拟回复
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      return '我理解你的想法。能多和我说说吗？我在这里听你倾诉~ 🫧';
    }
    return '你好！我是你的情绪小伙伴，有什么想和我聊聊的吗？ 💭';
  } catch (error) {
    console.error('AI聊天失败:', error);
    return '抱歉，我现在有点累，稍后再聊好吗？';
  }
}