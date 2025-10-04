'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

/**
 * 聊天功能hook - 安全地按用户隔离数据
 */
export function useChat(sessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchChatHistory = useCallback(async () => {
    try {
      const supabase = createClient();

      // 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log('用户未登录，返回空聊天历史');
        setMessages([]);
        return;
      }

      console.log('获取用户聊天历史:', { userId: user.id, sessionId });

      let query = supabase
        .from('chat')
        .select('*')
        .eq('user_id', user.id) // 只获取当前用户的聊天记录
        .order('created_at', { ascending: true });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log('成功获取聊天历史:', data?.length || 0);
      setMessages(data || []);
    } catch (fetchError) {
      console.error('获取聊天历史失败:', fetchError);
      setError('获取聊天历史失败');
    }
  }, [sessionId]);

  const scheduleHistoryRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      fetchChatHistory().catch(err => {
        console.warn('后台刷新聊天历史失败:', err);
      });
    }, 300);
  }, [fetchChatHistory]);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (content: string, onStream?: (chunk: string) => void) => {
    setIsLoading(true);
    setError(null);

    try {
      // 先添加用户消息到界面
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        user_id: '',
        role: 'user',
        message: content,
        session_id: sessionId,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // 调用AI聊天API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          messages: [...messages.map(m => ({
            role: m.role,
            content: m.message
          })), {
            role: 'user',
            content
          }],
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error('发送消息失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let aiMessage = '';

      // 处理流式响应
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              if (parsed.content) {
                aiMessage += parsed.content;
                onStream?.(parsed.content);
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              // 忽略解析错误
            }
          }
        }
      }

      // 添加AI回复到界面
      if (aiMessage) {
        const aiMessageObj: ChatMessage = {
          id: `temp-ai-${Date.now()}`,
          user_id: '',
          role: 'assistant',
          message: aiMessage,
          session_id: sessionId,
          created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMessageObj]);
      }

      // 异步刷新聊天历史（防抖，避免阻塞 UI）
      scheduleHistoryRefresh();

    } catch (sendError) {
      console.error('发送消息失败:', sendError);
      setError(sendError instanceof Error ? sendError.message : '发送消息失败');
    } finally {
      setIsLoading(false);
    }
  }, [messages, scheduleHistoryRefresh, sessionId]);

  // 清空聊天记录
  const clearChat = useCallback(async () => {
    try {
      const supabase = createClient();

      // 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('用户未登录');
      }

      console.log('清空用户聊天记录:', { userId: user.id, sessionId });

      let query = supabase
        .from('chat')
        .delete()
        .eq('user_id', user.id); // 只删除当前用户的聊天记录

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { error } = await query;

      if (error) {
        throw error;
      }

      console.log('聊天记录清空成功');
      setMessages([]);
    } catch (clearError) {
      console.error('清空聊天记录失败:', clearError);
      setError('清空聊天记录失败');
    }
  }, [sessionId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    fetchChatHistory
  };
}
