'use server';

import { supabaseServer } from '@/lib/supabase';
import { ChatMessage } from '@/lib/types';

/**
 * 创建聊天消息
 */
export async function createChatMessage(params: {
  role: 'user' | 'assistant';
  message: string;
  sessionId?: string;
}): Promise<ChatMessage> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      throw new Error('用户未登录');
    }

    const { data, error } = await (await supabaseServer)
      .from('chat')
      .insert([{
        user_id: user.id,
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
export async function getUserChatMessages(sessionId?: string): Promise<ChatMessage[]> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      return [];
    }

    let query = (await supabaseServer)
      .from('chat')
      .select('*')
      .eq('user_id', user.id);

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
export async function getRecentChatHistory(limit: number = 10): Promise<ChatMessage[]> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await (await supabaseServer)
      .from('chat')
      .select('*')
      .eq('user_id', user.id)
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
export async function deleteChatMessage(messageId: string): Promise<void> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      throw new Error('用户未登录');
    }

    const { error } = await (await supabaseServer)
      .from('chat')
      .delete()
      .eq('id', messageId)
      .eq('user_id', user.id);

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
export async function clearUserChatHistory(sessionId?: string): Promise<void> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      throw new Error('用户未登录');
    }

    let query = (await supabaseServer)
      .from('chat')
      .delete()
      .eq('user_id', user.id);

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