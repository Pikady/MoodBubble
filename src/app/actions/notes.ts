'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { aiReply } from '@/lib/ai';
import { CreateNoteParams, CreateNoteResult } from '@/lib/types';

export async function createNoteWithAI(params: CreateNoteParams): Promise<CreateNoteResult> {
  const { type, content } = params;

  // 验证输入
  if (!type || !content?.trim()) {
    throw new Error('类型和内容不能为空');
  }

  // 验证类型
  const validTypes = ['goodnight', 'gratitude', 'emotion', 'reflection'];
  if (!validTypes.includes(type)) {
    throw new Error('无效的纸条类型');
  }

  const supabase = await createServiceClient();

  try {
    // 获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    // 创建纸条
    const { data: note, error: insertError } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        type,
        content: content.trim(),
      })
      .select('id')
      .single();

    if (insertError || !note) {
      console.error('创建纸条失败:', insertError);
      throw new Error('创建纸条失败');
    }

    // 获取AI回复
    const started = Date.now();
    const aiResponse = await aiReply({ type, content: content.trim() });
    const latency = Date.now() - started;

    // 更新纸条，添加AI回复
    const { error: updateError } = await supabase
      .from('notes')
      .update({
        ai_reply: aiResponse,
        ai_model: 'gpt-4o-mini',
        ai_latency_ms: latency,
        updated_at: new Date().toISOString(),
      })
      .eq('id', note.id);

    if (updateError) {
      console.error('更新AI回复失败:', updateError);
      // 即使更新失败，也返回创建成功的纸条
    }

    return {
      id: note.id as string,
      ai_reply: aiResponse,
    };

  } catch (error) {
    console.error('创建纸条时出错:', error);
    throw error;
  }
}

export async function deleteNote(noteId: string): Promise<void> {
  if (!noteId) {
    throw new Error('纸条ID不能为空');
  }

  const supabase = await createServiceClient();

  try {
    // 获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    // 验证纸条所有权并删除
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('删除纸条失败:', deleteError);
      throw new Error('删除纸条失败');
    }

  } catch (error) {
    console.error('删除纸条时出错:', error);
    throw error;
  }
}

export async function getUserNotes() {
  const supabase = await createServiceClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取纸条失败:', error);
      throw new Error('获取纸条失败');
    }

    return notes || [];

  } catch (error) {
    console.error('获取用户纸条时出错:', error);
    throw error;
  }
}