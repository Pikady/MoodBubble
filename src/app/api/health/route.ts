import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 检查Supabase连接
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase连接失败',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase连接正常',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: '服务器错误',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}