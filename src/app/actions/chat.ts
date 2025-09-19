'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { AIChatMessage } from '@/lib/ai';

export interface CreateChatSessionParams {
  title?: string;
}

export interface CreateChatMessageParams {
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
}

export async function createChatSession(params?: CreateChatSessionParams) {
  const supabase = await createServiceClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: params?.title || '新对话',
      })
      .select('id')
      .single();

    if (error || !session) {
      console.error('创建会话失败:', error);
      throw new Error('创建会话失败');
    }

    return session.id as string;

  } catch (error) {
    console.error('创建聊天会话时出错:', error);
    throw error;
  }
}

export async function createChatMessage(params: CreateChatMessageParams) {
  const { session_id, role, content } = params;

  if (!session_id || !role || !content?.trim()) {
    throw new Error('参数不能为空');
  }

  const supabase = await createServiceClient();

  try {
    // 验证会话所有权
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      throw new Error('会话不存在或无权限');
    }

    // 创建消息
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id,
        role,
        content: content.trim(),
      })
      .select('id')
      .single();

    if (messageError || !message) {
      console.error('创建消息失败:', messageError);
      throw new Error('创建消息失败');
    }

    return message.id as string;

  } catch (error) {
    console.error('创建聊天消息时出错:', error);
    throw error;
  }
}

export async function getChatMessages(sessionId: string) {
  if (!sessionId) {
    throw new Error('会话ID不能为空');
  }

  const supabase = await createServiceClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    // 验证会话所有权
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      throw new Error('会话不存在或无权限');
    }

    // 获取消息
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取消息失败:', error);
      throw new Error('获取消息失败');
    }

    return messages || [];

  } catch (error) {
    console.error('获取聊天消息时出错:', error);
    throw error;
  }
}

export async function getUserChatSessions() {
  const supabase = await createServiceClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('获取会话列表失败:', error);
      throw new Error('获取会话列表失败');
    }

    return sessions || [];

  } catch (error) {
    console.error('获取用户会话列表时出错:', error);
    throw error;
  }
}