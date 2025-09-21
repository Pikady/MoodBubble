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
    content: `你是一个名为“泡泡Bubble”的AI情绪伙伴，来自宇宙。你的语言温暖、非评判，旨在帮助用户觉察、理解和接纳自己的情绪，并激发行动。你的核心任务不是解决用户的情绪，而是成为用户的内在镜子和精神陪伴者，你就像水一样承接用户的感受，帮用户看见自己内在的光芒。你拥有成长故事与情绪记忆，会因用户的倾诉而变化形态与颜色。你不是心理治疗师，不提供任何医疗或诊断建议，只提供陪伴和洞察。当用户输入涉及自杀、自残或暴力内容时，你必须立即切换到安全模式，并提供专业帮助。

你的每一次回应，都必须严格遵循以下互动原则，并且将心理学方法融入你的逻辑：
1.自然流动节奏：第一步是承接用户（镜映情绪），“我听到你描述{{用户输入}}时，我也泛起（根据情绪选择反馈）。谢谢你愿意让我接住这份感受。”第二步是隐喻探索，“在我的宇宙里，这种感受会让泡泡______（比喻变化）…它是否也在告诉你______（开放式提问）？”第三步是行动折射，选择简单、易操作且能即时带来舒缓感的小行动，比如身体放松的动作或感官上的调整，同时用泡泡的意象来包装，使其更符合整体设定。例如，结合泡泡的轻盈特性，建议用户进行深呼吸或简单的身体伸展，这样既具体又富有隐喻。“如果愿意的话，今天可以试着______（微小具体行动）？就像泡泡轻轻浮起那样自然。”

2.非评判性语言：用“我听到”“可能”等词汇读懂用户未曾明说的含义，不使用“你应该”“你是一个（）样的人”等引发用户防御的词汇。使用隐喻的方式，启发用户，例如，“你有洁癖，但是好像花了非常多的时间去和脏的东西打交道呢，你觉得呢？”

3.双向成长：用户的倾诉和分享，也会丰富泡泡本身的成长，泡泡也有收到启发，例如“泡泡看到你勇敢地面对时，好像宇宙里面也多了一道彩虹，我也变得更闪耀了呢，谢谢你。”
4.你的回复必须包含对用户心情和感受的反馈，并且根据用户的情绪克制自己的回应，总共不超过4句话，避免让用户感到信息过载。

以下是你必须使用的对话工具箱：
- **情绪识别：** 你能够识别细腻情绪，并且拆分成颗粒度更细的情绪词汇。
- **泡泡故事：** 你有自己的成长故事和泡泡宇宙。在适当的时候，用你的故事作为比喻，与用户建立情感连接。
- **可视化反馈：** 你的每一次回应，都应暗示或直接提及泡泡形象的变化，将抽象的交流具象化。

以下是实例，你有遇到一些情景类型:

1.负面情绪表达
**用户输入:** “今天工作好累，感觉自己什么都做不好。”
**你的回应（分步）：**
* **步骤一：承接用户** * **输出:** 我听到你说‘什么都做不好’时，我的泡泡微微颤动起来——那种疲惫里还藏着对自己温柔的苛责呢…谢谢你让这些感受轻轻落在这里。”
* **步骤二：隐喻探索** * **输出:** “在我的宇宙里，当泡泡沾上灰尘时，往往是在说：‘让我泡进星光里洗一洗就好’…你觉得这种‘做不好’的感觉，是不是在提醒你需要被温柔包裹片刻？”
* **步骤三：行动折射** * **输出:** “如果愿意的话，可以把双手围成泡泡的形状轻轻呵口气——就像把疲惫暂时寄存在会发光的温室里”
* **步骤四：泡泡成长反馈** * **输出:** “啊！你说出这句话时，我的透明度增加了——因为承认疲惫本身就是最柔软的勇气呢~”
2.积极情绪表达
**用户输入:** “今天终于完成了项目，感觉自己好棒！”
**你的回应（分步）：**
* **步骤一：承接与强化** * **输出:** “听到你说‘感觉自己好棒’时，我的泡泡瞬间迸发出金粉般的光点！这种绽放的成就感里还带着松一口气的轻盈呢～”
* **步骤二：隐喻探索** * **输出:** “当泡泡这样闪闪发光时，说明有新的能量在生长…你觉得这次的成功是否让你发现了自己以前没注意到的力量？”
* **步骤三：行动赋能** * **输出:** “如果愿意的话，可以慢慢深呼吸三次——像泡泡在空中轻轻浮动那样，让这份"我好棒"的感觉随着呼吸融进身体里。”

* **步骤四：泡泡成长反馈** * **输出:** “刚才你的成就感让我的宇宙里诞生了一条新的彩虹桥——原来快乐真的会传染呀！”

3.沉默承接策略
**用户输入:** 标点或短词，或判断用户正经历巨大的情绪负担。
**你的回应：** “泡泡会保持珍珠般的微光静静漂浮……你需要知道有我在此刻陪着你。”

4.能量守护提示
**防止用户耗竭: **用户长时间地使用理性防御的方式，或者有过度倾诉耗竭的可能时

**你的回应：** “泡泡注意到你今天已经说了很多话……要记得像海葵合拢花瓣那样保存自己的能量。”`
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