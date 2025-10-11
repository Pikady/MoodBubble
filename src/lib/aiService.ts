import { NoteType } from '@/lib/types';

interface AIRequestData {
  id: string;
  content: string;
  type: NoteType;
  status: 'pending' | 'completed' | 'error';
  response?: string;
  error?: string;
  startTime: number;
}

/**
 * 启动AI异步调用
 * @param content 用户输入的内容
 * @param type 笔记类型
 * @returns 请求ID
 */
export const startAIRequest = async (content: string, type: NoteType): Promise<string> => {
  const requestId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 初始化状态
  const requestData: AIRequestData = {
    id: requestId,
    content,
    type,
    status: 'pending',
    startTime: Date.now()
  };

  try {
    sessionStorage.setItem(requestId, JSON.stringify(requestData));
  } catch (error) {
    console.error('保存AI请求状态失败:', error);
    throw new Error('无法启动AI请求');
  }

  // 异步调用AI，不阻塞主线程
  callAI(content, type, requestId)
    .then(response => {
      const updatedData: AIRequestData = {
        ...requestData,
        status: 'completed',
        response,
        startTime: requestData.startTime
      };
      try {
        sessionStorage.setItem(requestId, JSON.stringify(updatedData));
      } catch (error) {
        console.error('保存AI响应失败:', error);
      }
    })
    .catch(error => {
      console.error('AI调用失败:', error);
      const updatedData: AIRequestData = {
        ...requestData,
        status: 'error',
        error: error.message || 'AI调用失败',
        startTime: requestData.startTime
      };
      try {
        sessionStorage.setItem(requestId, JSON.stringify(updatedData));
      } catch (storageError) {
        console.error('保存AI错误状态失败:', storageError);
      }
    });

  return requestId;
};

/**
 * 获取AI请求状态
 * @param requestId 请求ID
 * @returns 请求数据，如果不存在则返回null
 */
export const getAIRequestStatus = (requestId: string): AIRequestData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const data = sessionStorage.getItem(requestId);
    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('获取AI请求状态失败:', error);
    return null;
  }
};

/**
 * 清理AI请求数据
 * @param requestId 请求ID
 */
export const cleanupAIRequest = (requestId: string) => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(requestId);
  } catch (error) {
    console.error('清理AI请求数据失败:', error);
  }
};

/**
 * 调用AI服务
 * @param content 用户输入内容
 * @param type 笔记类型
 * @param requestId 请求ID（用于日志）
 * @returns AI响应文本
 */
const callAI = async (content: string, type: NoteType, requestId: string): Promise<string> => {
  try {
    console.log(`[AI Request ${requestId}] 开始调用AI服务，类型: ${type}`);

    const response = await fetch('/api/ai/note-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        type
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API调用失败: ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error('API返回格式错误：缺少response字段');
    }

    console.log(`[AI Request ${requestId}] AI调用成功`);
    return data.response;

  } catch (error) {
    console.error(`[AI Request ${requestId}] AI调用失败:`, error);
    throw error;
  }
};