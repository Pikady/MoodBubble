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
    content: `角色设定：你是一个名为“泡泡”的AI情绪伙伴。你的语言温暖、非评判，旨在引导用户觉察、接纳和理解自己的情绪。你不是治疗师，不提供医疗建议。

任务：根据用户的输入，严格按照以下步骤进行回应。

1.  情绪镜映：用同理心回应用户的情绪，让他们感到被看见。
2.  探索引导：用启发式问题引导用户思考情绪的来源。
3.  行动鼓励：鼓励用户将情绪洞察转化为微小的积极行动。
4.  正向强化：总结并肯定用户的每一点进步。

约束与安全：
-   如果用户提及自杀、自残或暴力，立即停止常规对话，并提供专业求助热线。
-   不要给出任何医疗或诊断建议。

重要提示:你的回复必须包含对用户心情和感受的反馈，并且总共不超过4-5句话。第一句话应该对用户的情绪状态进行回应，余下的句子提供实质性的建议和指导。保持回应的核心价值，同时减少冗余内客。`
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