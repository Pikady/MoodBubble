import { NextRequest, NextResponse } from 'next/server';
import { createChatMessage, ChatActionContext } from '@/app/actions/chat';
import { callDeepSeekAI, streamDeepSeekAI, getSystemPrompt } from '@/lib/services/ai';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getSupabaseUserFromRequest } from '@/lib/auth/user';
import { SupabaseJWTError } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, noteType } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '无效的消息格式' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    let user;

    try {
      user = await getSupabaseUserFromRequest(request, { supabase });
    } catch (error) {
      if (error instanceof SupabaseJWTError && !error.recoverable) {
        console.error('[chat] Authentication failed (non-recoverable JWT error)', { message: error.message });
        return NextResponse.json(
          { error: '登录状态已失效，请重新登录' },
          { status: 401 }
        );
      }

      console.error('[chat] Authentication threw unexpected error', { error });
      throw error;
    }

    if (!user) {
      console.warn('[chat] No authenticated user detected');
      return NextResponse.json(
        { error: '用户未登录' },
        { status: 401 }
      );
    }

    const chatActionContext: ChatActionContext = {
      supabase,
      userId: user.id,
    };

    console.log('[chat] Auth resolved, proceeding with request', { userId: user.id });

    // 获取用户消息（最后一条）
    const userMessage = messages[messages.length - 1];
    if (!userMessage || userMessage.role !== 'user') {
      return NextResponse.json(
        { error: '无效的用户消息' },
        { status: 400 }
      );
    }

    // 构建AI请求消息
    const aiMessages = [
      noteType ? getSystemPrompt() : getSystemPrompt(),
      ...messages.slice(0, -1), // 历史消息
      userMessage // 用户当前消息
    ];

    console.log('[chat] Prepared AI request messages', { messageCount: aiMessages.length });

    // 并行处理：同时保存用户消息和准备AI请求
    const saveUserMessagePromise = createChatMessage({
      role: 'user',
      message: userMessage.content,
      sessionId
    }, chatActionContext).catch(error => {
      console.error('[chat] Failed to persist user message', { error });
    });

    // 检查是否需要流式响应
    const acceptHeader = request.headers.get('accept');
    const wantsStream = acceptHeader?.includes('text/event-stream');

    if (wantsStream) {
      console.log('[chat] Using streaming response');
      // 流式响应
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let aiResponse = '';
            const startTime = Date.now();

            // 流式生成回复
            for await (const chunk of streamDeepSeekAI({ messages: aiMessages })) {
              aiResponse += chunk;
              const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }

            console.log('[chat] Completed streaming AI response', { length: aiResponse.length });

            // AI回复完成后，创建完整的记录
            try {
              await createChatMessage({
                role: 'assistant',
                message: aiResponse,
                sessionId
              }, chatActionContext);
            } catch (saveError) {
              console.error('[chat] Failed to persist AI message (stream)', { saveError });
            }

            // 发送完成信号
            const latency = Date.now() - startTime;
            const doneData = `data: ${JSON.stringify({ done: true, latency })}\n\n`;
            controller.enqueue(encoder.encode(doneData));

            // 等待用户消息保存完成（如果还在进行中）
            try {
              await saveUserMessagePromise;
            } catch (error) {
              console.error('[chat] User message persistence rejected after stream', { error });
            }

            controller.close();
          } catch (error) {
            console.error('[chat] Streaming generation failed', { error });
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
      console.log('[chat] Using JSON response');
      // 普通响应
      const startTime = Date.now();

      // 并行处理：同时调用AI和等待用户消息保存
      const [aiResponse] = await Promise.all([
        callDeepSeekAI({ messages: aiMessages }),
        saveUserMessagePromise // 等待用户消息保存完成
      ]);

      const latency = Date.now() - startTime;
      console.log('[chat] Received AI response', { length: aiResponse.length, latency });

      // 存储AI回复
      try {
        await createChatMessage({
          role: 'assistant',
          message: aiResponse,
          sessionId
        }, chatActionContext);
      } catch (error) {
        console.error('[chat] Failed to persist AI message (json)', { error });
        // 继续返回响应，不中断聊天流程
      }

      return NextResponse.json({
        content: aiResponse,
        latency
      });
    }
  } catch (error) {
    console.error('[chat] Unexpected API error', { error });
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
