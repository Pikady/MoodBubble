'use server';

import { supabaseServer } from '@/lib/supabase';

// 检查Supabase是否已配置
function isSupabaseConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return supabaseUrl && supabaseAnonKey &&
         supabaseUrl !== 'your_supabase_project_url' &&
         supabaseAnonKey !== 'your_supabase_anon_key';
}

/**
 * 用户登录
 */
export async function loginWithEmailPassword(params: {
  email: string;
  password: string;
}) {
  try {
    // 检查Supabase是否已配置
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase未配置，请在.env.local文件中配置正确的Supabase URL和密钥');
    }

    const supabase = await supabaseServer;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      throw new Error('邮箱或密码错误');
    }

    // 获取用户信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', data.user?.id)
      .single();

    if (userError) {
      // 如果用户不存在于users表中，创建一个
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user?.id,
            email: data.user?.email,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (createError) {
        throw new Error('创建用户记录失败');
      }

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          createdAt: newUser.created_at,
        },
      };
    }

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        createdAt: userData.created_at,
      },
    };
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 用户登出
 */
export async function logout() {
  try {
    const supabase = await supabaseServer;
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('登出失败');
    }

    return { success: true };
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  try {
    const supabase = await supabaseServer;
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // 获取用户详细信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', user.id)
      .single();

    if (userError) {
      return null;
    }

    return {
      id: userData.id,
      email: userData.email,
      createdAt: userData.created_at,
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}