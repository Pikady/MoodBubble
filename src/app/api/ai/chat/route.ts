import { NextRequest, NextResponse } from 'next/server';
import { createChatMessage } from '@/app/actions/chat';
import { callDeepSeekAI, streamDeepSeekAI, getSystemPrompt } from '@/lib/services/ai';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, noteType } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '无效的消息格式' },
        { status: 400 }
      );
    }

    // 获取当前用户
    const supabase = await supabaseServer;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '用户未登录' },
        { status: 401 }
      );
    }

    // 获取用户消息（最后一条）
    const userMessage = messages[messages.length - 1];
    if (!userMessage || userMessage.role !== 'user') {
      return NextResponse.json(
        { error: '无效的用户消息' },
        { status: 400 }
      );
    }

    // 存储用户消息
    try {
      await createChatMessage({
        role: 'user',
        message: userMessage.content,
        sessionId
      });
    } catch (error) {
      console.error('存储用户消息失败:', error);
      // 继续处理，不中断聊天流程
    }

    // 构建AI请求消息
    const aiMessages = [
      noteType ? getSystemPrompt() : getSystemPrompt(),
      ...messages.slice(0, -1), // 历史消息
      userMessage // 用户当前消息
    ];

    // 检查是否需要流式响应
    const acceptHeader = request.headers.get('accept');
    const wantsStream = acceptHeader?.includes('text/event-stream');

    if (wantsStream) {
      // 流式响应
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let aiResponse = '';
            let startTime = Date.now();

            // 创建AI回复的占位记录
            const aiMessageRecord = await createChatMessage({
              role: 'assistant',
              message: '', // 初始为空，后续更新
              sessionId
            });

            // 流式生成回复
            for await (const chunk of streamDeepSeekAI({ messages: aiMessages })) {
              aiResponse += chunk;
              const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }

            // 更新AI回复记录
            try {
              const chatSupabase = await supabaseServer;
              await chatSupabase
                .from('chat')
                .update({
                  message: aiResponse,
                  updated_at: new Date().toISOString()
                })
                .eq('id', aiMessageRecord.id);
            } catch (updateError) {
              console.error('更新AI回复失败:', updateError);
            }

            // 发送完成信号
            const latency = Date.now() - startTime;
            const doneData = `data: ${JSON.stringify({ done: true, latency })}\n\n`;
            controller.enqueue(encoder.encode(doneData));
            controller.close();
          } catch (error) {
            console.error('流式生成失败:', error);
            const errorData = `data: ${JSON.stringify({ error: 'AI服务暂时不可用，请稍后重试' })}\n\n`;
            controller.enqueue(encoder.encode(errorData));
            controller.close();
          }
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // 普通响应
      const startTime = Date.now();
      const aiResponse = await callDeepSeekAI({ messages: aiMessages });
      const latency = Date.now() - startTime;

      // 存储AI回复
      try {
        await createChatMessage({
          role: 'assistant',
          message: aiResponse,
          sessionId
        });
      } catch (error) {
        console.error('存储AI回复失败:', error);
        // 继续返回响应，不中断聊天流程
      }

      return NextResponse.json({
        content: aiResponse,
        latency
      });
    }
  } catch (error) {
    console.error('聊天API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI聊天API运行正常',
    timestamp: new Date().toISOString()
  });
}