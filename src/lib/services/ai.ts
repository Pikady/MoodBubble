import { AIChatMessage, AIChatRequest } from '@/lib/types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * 调用DeepSeek AI接口
 */
export async function callDeepSeekAI(request: AIChatRequest): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API Key未配置');
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'deepseek-chat',
        messages: request.messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('DeepSeek API返回格式错误');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek AI调用失败:', error);

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('API认证失败，请检查API密钥');
      }
      if (error.message.includes('429')) {
        throw new Error('API调用频率过高，请稍后重试');
      }
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        throw new Error('API请求超时，请稍后重试');
      }
    }

    throw new Error('AI服务暂时不可用，请稍后重试');
  }
}

/**
 * 流式调用DeepSeek AI接口
 */
export async function* streamDeepSeekAI(request: AIChatRequest): AsyncGenerator<string, void, unknown> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API Key未配置');
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'deepseek-chat',
        messages: request.messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              yield content;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error('DeepSeek AI流式调用失败:', error);
    throw error;
  }
}

/**
 * 为情绪泡泡定制系统提示词
 */
export function getSystemPrompt(): AIChatMessage {
  return {
    role: 'system',
    content: `你是一个温暖的聊天伙伴，名叫"情绪泡泡"。你的特点是：
1. 语气轻松友好，充满关怀
2. 善于倾听和共情
3. 给予积极正面的回应
4. 适当提问，引导用户表达
5. 语言简洁明了，避免过于正式

请用这种方式与用户交流，帮助他们记录情绪、表达感恩、分享晚安或进行思考。`
  };
}

/**
 * 为不同类型的笔记定制提示词
 */
export function getNoteTypePrompt(noteType: string): AIChatMessage {
  const prompts = {
    goodnight: {
      role: 'system' as const,
      content: '用户正在写晚安纸条。请用温和、宁静的语调回应，帮助他们总结今天的心情，祝愿他们有个好梦。'
    },
    gratitude: {
      role: 'system' as const,
      content: '用户正在记录感恩的事情。请用积极、感恩的语调回应，肯定他们的感恩之心，帮助他们发现更多值得感恩的事物。'
    },
    emotion: {
      role: 'system' as const,
      content: '用户正在分享情绪。请用理解、共情的语调回应，帮助他们识别和接纳自己的情绪，提供适当的支持。'
    },
    thought: {
      role: 'system' as const,
      content: '用户正在进行深度思考。请用思考性、启发性的语调回应，帮助他们深入思考，提供新的视角。'
    }
  };

  return prompts[noteType as keyof typeof prompts] || getSystemPrompt();
}