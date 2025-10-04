'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { ChatMessage } from '@/lib/types';

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export interface ChatActionContext {
  supabase?: ServerSupabaseClient;
  userId?: string;
}

async function resolveContext(
  context: ChatActionContext | undefined,
  requireUser: true
): Promise<{ supabase: ServerSupabaseClient; userId: string }>;
async function resolveContext(
  context?: ChatActionContext,
  requireUser?: boolean
): Promise<{ supabase: ServerSupabaseClient; userId?: string }>;
async function resolveContext(
  context?: ChatActionContext,
  requireUser: boolean = false
): Promise<{ supabase: ServerSupabaseClient; userId?: string }> {
  if (context?.supabase) {
    if (context.userId) {
      return { supabase: context.supabase, userId: context.userId };
    }

    const { data: { user } } = await context.supabase.auth.getUser();

    if (requireUser) {
      if (!user) {
        throw new Error('用户未登录');
      }
      return { supabase: context.supabase, userId: user.id };
    }

    return { supabase: context.supabase, userId: user?.id };
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (requireUser) {
    if (!user) {
      throw new Error('用户未登录');
    }
    return { supabase, userId: user.id };
  }

  return { supabase, userId: user?.id };
}

/**
 * 创建聊天消息
 */
export async function createChatMessage(
  params: {
    role: 'user' | 'assistant';
    message: string;
    sessionId?: string;
  },
  context?: ChatActionContext
): Promise<ChatMessage> {
  try {
    const { supabase, userId } = await resolveContext(context, true);

    const { data, error } = await supabase
      .from('chat')
      .insert([{
        user_id: userId,
        role: params.role,
        message: params.message,
        session_id: params.sessionId || null
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('创建聊天消息失败:', error);
    throw new Error('创建聊天消息失败');
  }
}

/**
 * 获取用户的所有聊天消息
 */
export async function getUserChatMessages(
  sessionId?: string,
  context?: ChatActionContext
): Promise<ChatMessage[]> {
  try {
    const { supabase, userId } = await resolveContext(context);

    if (!userId) {
      return [];
    }

    let query = supabase
      .from('chat')
      .select('*')
      .eq('user_id', userId);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('获取聊天消息失败:', error);
    throw new Error('获取聊天消息失败');
  }
}

/**
 * 获取最近的聊天历史（用于上下文）
 */
export async function getRecentChatHistory(
  limit: number = 10,
  context?: ChatActionContext
): Promise<ChatMessage[]> {
  try {
    const { supabase, userId } = await resolveContext(context);

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).reverse();
  } catch (error) {
    console.error('获取聊天历史失败:', error);
    throw new Error('获取聊天历史失败');
  }
}

/**
 * 删除聊天消息
 */
export async function deleteChatMessage(
  messageId: string,
  context?: ChatActionContext
): Promise<void> {
  try {
    const { supabase, userId } = await resolveContext(context, true);

    const { error } = await supabase
      .from('chat')
      .delete()
      .eq('id', messageId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('删除聊天消息失败:', error);
    throw new Error('删除聊天消息失败');
  }
}

/**
 * 清空用户的聊天记录
 */
export async function clearUserChatHistory(
  sessionId?: string,
  context?: ChatActionContext
): Promise<void> {
  try {
    const { supabase, userId } = await resolveContext(context, true);

    let query = supabase
      .from('chat')
      .delete()
      .eq('user_id', userId);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { error } = await query;

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('清空聊天记录失败:', error);
    throw new Error('清空聊天记录失败');
  }
}
