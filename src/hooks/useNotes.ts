'use client';

import useSWR from 'swr';
import { Note, NoteType } from '@/lib/types';
import { supabase } from '@/lib/supabase';

/**
 * 获取用户笔记的hook
 */
export function useNotes(type?: NoteType) {

  const fetchNotes = async (): Promise<Note[]> => {
    if (!supabase) {
      throw new Error('Supabase 客户端未初始化');
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (type) {
      return data?.filter(note => note.type === type) || [];
    }

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
    if (!supabase) {
      throw new Error('Supabase 客户端未初始化');
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([params])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 更新本地缓存
    mutate();

    return data;
  };

  // 更新笔记
  const updateNote = async (noteId: string, content: string) => {
    if (!supabase) {
      throw new Error('Supabase 客户端未初始化');
    }

    const { data, error } = await supabase
      .from('notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 更新本地缓存
    mutate();

    return data;
  };

  // 删除笔记
  const deleteNote = async (noteId: string) => {
    if (!supabase) {
      throw new Error('Supabase 客户端未初始化');
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      throw error;
    }

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