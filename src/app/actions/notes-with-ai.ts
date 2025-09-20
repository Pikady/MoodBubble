'use server';

import { createNote, updateNoteAIReply } from './notes';
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

    // 4. 将AI回复保存到notes表
    try {
      await updateNoteAIReply(noteId, aiReply, {
        ai_model: 'deepseek-chat',
        ai_latency_ms: latency
      });
    } catch (error) {
      console.error('保存AI回复到笔记失败:', error);
      // 继续执行，不中断流程
    }

    // 5. 存储AI回复到聊天记录（可选，保持向后兼容）
    try {
      await createChatMessage({
        role: 'assistant',
        message: aiReply,
        sessionId: noteId // 使用笔记ID作为会话ID
      });
    } catch (error) {
      console.error('存储AI回复到聊天记录失败:', error);
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
 * 为现有笔记生成AI回复
 */
export async function generateAIReplyForNote(noteId: string): Promise<{
  aiReply: string;
  latency?: number;
}> {
  try {
    // 1. 获取笔记内容
    const { getNoteById } = await import('./notes');
    const note = await getNoteById(noteId);

    if (!note) {
      throw new Error('笔记不存在');
    }

    // 2. 如果已经有AI回复，直接返回
    if (note.ai_reply) {
      return {
        aiReply: note.ai_reply
      };
    }

    // 3. 构建AI请求
    const messages = [
      getNoteTypePrompt(note.type),
      {
        role: 'user' as const,
        content: note.content
      }
    ];

    // 4. 调用AI获取回复
    const startTime = Date.now();
    const aiReply = await callDeepSeekAI({ messages });
    const latency = Date.now() - startTime;

    // 5. 将AI回复保存到notes表
    try {
      await updateNoteAIReply(noteId, aiReply, {
        ai_model: 'deepseek-chat',
        ai_latency_ms: latency
      });
    } catch (error) {
      console.error('保存AI回复到笔记失败:', error);
      // 继续执行，不中断流程
    }

    // 6. 存储AI回复到聊天记录（可选）
    try {
      await createChatMessage({
        role: 'assistant',
        message: aiReply,
        sessionId: noteId // 使用笔记ID作为会话ID
      });
    } catch (error) {
      console.error('存储AI回复到聊天记录失败:', error);
      // 继续执行，不中断流程
    }

    return {
      aiReply,
      latency
    };
  } catch (error) {
    console.error('为笔记生成AI回复失败:', error);

    if (error instanceof Error) {
      throw new Error(`生成AI回复失败: ${error.message}`);
    }

    throw new Error('为笔记生成AI回复失败');
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