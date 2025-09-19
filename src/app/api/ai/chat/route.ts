import { NextRequest, NextResponse } from 'next/server';
import { aiChat, AIChatOptions } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 解析请求体
    const body = await request.json();
    const { messages, model, temperature, maxTokens } = body as AIChatOptions;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: '无效的消息格式' }, { status: 400 });
    }

    // 验证消息格式
    const isValidMessage = messages.every(msg =>
      msg && typeof msg === 'object' &&
      ['system', 'user', 'assistant'].includes(msg.role) &&
      typeof msg.content === 'string'
    );

    if (!isValidMessage) {
      return NextResponse.json({ error: '消息格式不正确' }, { status: 400 });
    }

    // 调用AI服务
    const reply = await aiChat({
      messages,
      model: model || 'gpt-4o-mini',
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 1000
    });

    // 返回流式响应
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        // 发送回复内容
        const chunk = encoder.encode(reply);
        controller.enqueue(chunk);

        // 结束流
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('AI聊天API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}