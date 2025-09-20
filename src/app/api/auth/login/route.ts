import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 使用Supabase进行邮箱密码登录
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('登录错误:', error);
      return NextResponse.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 获取用户信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', data.user?.id)
      .single();

    if (userError) {
      console.error('获取用户信息错误:', userError);
      // 如果用户不存在于users表中，可以创建一个
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
        console.error('创建用户记录错误:', createError);
        return NextResponse.json(
          { success: false, message: '创建用户记录失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '登录成功',
        user: {
          id: newUser.id,
          email: newUser.email,
          createdAt: newUser.created_at,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        id: userData.id,
        email: userData.email,
        createdAt: userData.created_at,
      },
    });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}