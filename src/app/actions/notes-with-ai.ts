'use server';

import { createNote } from './notes';
import { createChatMessage } from './chat';
import { callDeepSeekAI, getNoteTypePrompt } from '@/lib/services/ai';
import { NoteType, CreateNoteParams } from '@/lib/types';

/**
 * 创建笔记并获取AI回复
 */
export async function createNoteWithAI(params: CreateNoteParams): Promise<{
  noteId: string;
  aiReply: string;
  latency?: number;
}> {
  try {
    // 1. 创建笔记
    const { id: noteId } = await createNote(params);

    // 2. 构建AI请求
    const messages = [
      getNoteTypePrompt(params.type),
      {
        role: 'user' as const,
        content: params.content
      }
    ];

    // 3. 调用AI获取回复
    const startTime = Date.now();
    const aiReply = await callDeepSeekAI({ messages });
    const latency = Date.now() - startTime;

    // 4. 存储AI回复到聊天记录
    try {
      await createChatMessage({
        role: 'assistant',
        message: aiReply,
        sessionId: noteId // 使用笔记ID作为会话ID
      });
    } catch (error) {
      console.error('存储AI回复失败:', error);
      // 继续执行，不中断流程
    }

    return {
      noteId,
      aiReply,
      latency
    };
  } catch (error) {
    console.error('创建笔记和AI回复失败:', error);

    if (error instanceof Error) {
      throw new Error(`创建失败: ${error.message}`);
    }

    throw new Error('创建笔记和AI回复失败');
  }
}

/**
 * 获取笔记的AI回复历史
 */
export async function getNoteAIHistory(noteId: string) {
  try {
    // 这里可以通过查询chat表，使用noteId作为sessionId来获取相关聊天记录
    // 实现需要根据具体需求调整
    return [];
  } catch (error) {
    console.error('获取笔记AI历史失败:', error);
    return [];
  }
}