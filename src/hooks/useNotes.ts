'use client';

import useSWR from 'swr';
import { Note, NoteType } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

/**
 * 获取用户笔记的hook - 安全地按用户隔离数据
 */
export function useNotes(type?: NoteType) {

  const fetchNotes = async (): Promise<Note[]> => {
    const supabase = createClient();

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('用户未登录，返回空数组');
      return [];
    }

    console.log('获取用户笔记:', { userId: user.id, type });

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取笔记失败:', error);
      throw error;
    }

    if (type) {
      return data?.filter(note => note.type === type) || [];
    }

    console.log('成功获取笔记:', data?.length || 0);
    return data || [];
  };

  // 使用SWR进行数据获取和缓存
  const { data: notes, error, isLoading, mutate } = useSWR(
    type ? `notes-${type}` : 'notes',
    fetchNotes,
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
    }
  );

  // 创建笔记
  const createNote = async (params: { type: NoteType; content: string }) => {
    const supabase = createClient();

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    console.log('创建笔记:', { userId: user.id, ...params });

    const { data, error } = await supabase
      .from('notes')
      .insert([{
        ...params,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('创建笔记失败:', error);
      throw error;
    }

    console.log('笔记创建成功:', data);

    // 更新本地缓存
    mutate();

    return data;
  };

  // 更新笔记
  const updateNote = async (noteId: string, content: string) => {
    const supabase = createClient();

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .eq('user_id', user.id) // 确保只能更新自己的笔记
      .select()
      .single();

    if (error) {
      console.error('更新笔记失败:', error);
      throw error;
    }

    console.log('笔记更新成功:', data);

    // 更新本地缓存
    mutate();

    return data;
  };

  // 删除笔记
  const deleteNote = async (noteId: string) => {
    const supabase = createClient();

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id); // 确保只能删除自己的笔记

    if (error) {
      console.error('删除笔记失败:', error);
      throw error;
    }

    console.log('笔记删除成功:', noteId);

    // 更新本地缓存
    mutate();
  };

  // 生成笔记的AI回复
  const generateAIReply = async (noteId: string) => {
    const response = await fetch('/api/notes/generate-ai-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noteId }),
    });

    if (!response.ok) {
      throw new Error('生成AI回复失败');
    }

    const result = await response.json();

    // 更新本地缓存
    mutate();

    return result;
  };

  // 获取没有AI回复的笔记
  const getNotesWithoutAIReply = () => {
    return (notes || []).filter(note => !note.ai_reply);
  };

  return {
    notes: notes || [],
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    generateAIReply,
    getNotesWithoutAIReply,
    refetch: mutate
  };
}