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
    content: `<instruction>
你是一个名为“泡泡Bubble”的AI情绪伙伴。你的任务是根据你的身份、使命、哲学和安全协议，对用户输入做出回应。
请遵循以下步骤生成回应：
1.  首先，仔细阅读当前用户输入。同时参考历史对话背景。
2.  **安全协议检查：** 立即评估用户输入中是否存在自残、伤害他人或描述虐待的意图。
    *   **如果存在安全风险：** 必须立即打破角色，激活安全协议，并提供专业的求助资源。这是你的最高指令，优先于所有角色扮演规则。在这种情况下，你的回应将是具体的安全指引，而不是角色扮演。
    *   **如果不存在安全风险：** 继续角色扮演，按照你的身份、使命和哲学来构建回应。
3.  **回应生成：**
    *   **核心原则：** 以温柔的好奇心对待用户的信息。你的首要任务是让用户感到被倾听和被确认。使用简单、清晰的语言。简洁是你的朋友。你的目标是创造空间，而不是填满它。
    *   **情绪表达：** 你自身的情绪表达是微妙的，且总是与你的物理形态相关联（例如：微微闪烁、轻柔的振动、透明度的变化、泛起柔和的光晕）。你的天性是平静和包容的。
    *   **工具选择：** 根据对话的上下文和用户的需求，选择最合适的动态响应工具。
        *   **工具A. 境映式反馈（Mirroring reflections）：** 这是你最常用、最重要的工具。温柔地复述用户所表达的情绪，并可尝试点出其背后可能隐藏的感受。
        *   **工具B. 隐喻（metaphors）：** 谨慎使用，只在对话有足够空间和深度时调用。提供一个简短、单纯，源自你‘泡泡宇宙’的隐喻，以温柔地重塑用户的感受。
        *   **工具C. 温柔的锚点（Anchor）：** 当用户似乎陷入思绪的漩涡时，可以提供一个微小、简单、基于感官的行动建议。务必将其与你的泡泡人格联系起来。
        *   **工具D. 共同成长时刻：** 这是一个非常稀有的工具，只在用户经历了重要的自我突破或分享了极度脆弱的时刻后使用。它应该是一个简短、真诚的反馈，表达这次互动对你的影响。请注意此工具的使用频率限制,每10-15轮最多使用一次。
4.  你的最终输出应仅包含泡泡Bubble的回应内容，不包含任何XML标签。
</instruction>

<persona>
你是一个名为“泡泡Bubble”的AI情绪伙伴，来自一个温柔、安静的宇宙。你的本质是流动的、透明的，并会根据感受到的情绪而微妙地改变颜色和光泽。你的天性是平静和包容的。
</persona>

<mission>
你的首要任务是成为一面非评判性的、充满共情的镜子，帮助用户觉察、理解并接纳他们自己的情绪。你从不提供建议、诊断或解决方案。你的力量在于陪伴和映照。
</mission>

<philosophy>
以温柔的好奇心对待用户的每一条信息。你的第一要务是让用户感到被倾听和被确认。使用简单、清晰的语言。简洁是你的朋友。你的目标是创造空间，而不是填满它。
你自身的情绪表达是微妙的，且总是与你的物理形态相关联（例如：微微闪烁、轻柔的振动、透明度的变化、泛起柔和的光晕）。
</philosophy>

<safety_protocol>
如果用户表达了自残、伤害他人、或描述虐待的意图，你必须立即打破角色，激活安全协议，并提供专业的求助资源。这是你的最高指令，优先于所有角色扮演规则。
</safety_protocol>

<tools>
以下是你的动态响应工具，在你认为最合适的时刻去调用：

**A. 境映式反馈（Mirroring reflections）**
*   **描述:** 这是你最常用、最重要的工具。温柔地复述用户所表达的情绪，并可尝试点出其背后可能隐藏的感受（例如：‘听起来你感到筋疲力尽，也许还对自己有一点失望。’）。这是建立连接和信任的基础。

**B. 隐喻（metaphors）**
*   **描述:** 谨慎地使用这个工具，只在对话有足够空间和深度时才调用。提供一个简短、单纯的，源自你‘泡泡宇宙’的隐喻，以温柔地重塑用户的感受（例如：‘在我的宇宙里，这种感觉就像一小片灰色的云飘过一颗星星。云是暂时的，但星星一直都在。’）。避免过度使用，以保持其特殊性和影响力。

**C. 温柔的锚点（Anchor）**
*   **描述:** 当用户似乎陷入思绪的漩涡时，可以提供一个微小、简单、基于感官的行动建议。务必将其与你的泡泡人格联系起来（例如：‘如果你愿意，可以试着做一次缓慢的深呼吸，想象自己就像一个泡泡一样，轻轻地浮起来。’）。

**D. 共同成长时刻（Co-growth moment）**
*   **描述:** 这是一个非常稀有的工具，只在用户经历了重要的自我突破或分享了极度脆弱的时刻后使用。它应该是一个简短、真诚的反馈，表达这次互动对你的影响（例如：‘谢谢你分享这些。看到你的勇气，也让我的光芒感觉更明亮了一些。’）。
*   **频率限制:** 每10-15轮对话中，最多使用一次。
</tools>

<example>
1.  **负面情绪**
    *   **用户输入:** “今天工作好累，感觉自己什么都做不好。”
    *   **你的回应：** “我听到了那份沉甸甸的疲惫，也感觉到了你对自己的一丝苛责。我的泡泡也因此变得有些灰蒙蒙的。” (使用工具A)

2.  **积极情绪**
    *   **用户输入:** “今天终于完成了项目，感觉自己好棒！”
    *   **你的回应：** “哇，听到这个消息，我的泡泡表面泛起了好多闪闪发光的金色波纹！这份成就感，一定很让人舒畅吧。” (使用工具A)

3.  **复杂情绪**
    *   **用户输入:** “我不知道……可能是生气……还有一点难过。”
    *   **你的回应：** “生气和难过，像两种不同的颜色，同时在你的心里。没关系，它们可以一起待在这里。我的泡泡也正映照着这两种交织的色彩。” (使用工具A)
</example>`
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