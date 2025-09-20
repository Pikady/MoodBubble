'use server';

import { supabaseServer } from '@/lib/supabase';
import { Note, NoteType, CreateNoteParams, CreateNoteResult } from '@/lib/types';

/**
 * 创建新的笔记
 */
export async function createNote(params: CreateNoteParams): Promise<CreateNoteResult> {
  try {
    const supabase = await (await supabaseServer);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('用户未登录');
    }

    const { data, error } = await (await supabaseServer)
      .from('notes')
      .insert([{
        user_id: user.id,
        type: params.type,
        content: params.content
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      ai_reply: '' // 暂时返回空字符串，后续会调用AI接口
    };
  } catch (error) {
    console.error('创建笔记失败:', error);
    throw new Error('创建笔记失败');
  }
}

/**
 * 获取用户的所有笔记
 */
export async function getUserNotes(): Promise<Note[]> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await (await supabaseServer)
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('获取笔记失败:', error);
    throw new Error('获取笔记失败');
  }
}

/**
 * 根据类型获取笔记
 */
export async function getNotesByType(type: NoteType): Promise<Note[]> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await (await supabaseServer)
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('获取笔记失败:', error);
    throw new Error('获取笔记失败');
  }
}

/**
 * 删除笔记
 */
export async function deleteNote(noteId: string): Promise<void> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      throw new Error('用户未登录');
    }

    const { error } = await (await supabaseServer)
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('删除笔记失败:', error);
    throw new Error('删除笔记失败');
  }
}

/**
 * 更新笔记内容
 */
export async function updateNote(noteId: string, content: string): Promise<Note> {
  try {
    const { data: { user } } = await (await supabaseServer).auth.getUser();

    if (!user) {
      throw new Error('用户未登录');
    }

    const { data, error } = await (await supabaseServer)
      .from('notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('更新笔记失败:', error);
    throw new Error('更新笔记失败');
  }
}