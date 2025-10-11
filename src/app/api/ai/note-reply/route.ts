import { NextRequest, NextResponse } from 'next/server';
import { callDeepSeekAI, getNoteTypePrompt } from '@/lib/services/ai';
import { AIChatMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { content, type } = await request.json();

    if (!content || !type) {
      return NextResponse.json(
        { error: '缺少必要参数：content 和 type' },
        { status: 400 }
      );
    }

    // 构建AI消息
    const messages: AIChatMessage[] = [
      getNoteTypePrompt(type),
      { role: 'user', content }
    ];

    // 调用AI服务
    const response = await callDeepSeekAI({ messages });

    return NextResponse.json({ response });

  } catch (error) {
    console.error('AI回复生成失败:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : '生成AI回复时发生未知错误';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}