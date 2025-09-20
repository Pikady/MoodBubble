明白了，我会帮你整理一个**前端开发者专用文档**，把 **数据库文档** 和 **DeepSeek AI 对接文档** 整合在一起，统一成 **Markdown 版本**，前端团队可以直接参考，拿到就能做开发。

文档分为两大部分：

1. **数据库接口与数据结构**
2. **DeepSeek AI 对接说明**

---

# 📝 前端开发者文档

## 目录

1. [数据库结构与接口](#数据库结构与接口)

   1. [表结构](#表结构)
   2. [权限与RLS](#权限与rls)
   3. [前端调用示例](#前端调用示例)
2. [DeepSeek AI 对接说明](#deepseek-ai-对接说明)

   1. [API 基本配置](#api-基本配置)
   2. [消息流与角色](#消息流与角色)
   3. [调用示例](#调用示例)
   4. [错误处理与最佳实践](#错误处理与最佳实践)

---

## 数据库结构与接口

本项目使用 **Supabase** 作为后端，前端通过 Supabase SDK 直接调用 API，所有表都开启了 **RLS（Row Level Security）**，保证用户只能访问自己的数据。

---

### 表结构

#### 1. notes 表

| 字段          | 类型        | 说明                  |
| ----------- | --------- | ------------------- |
| id          | uuid      | 主键，自动生成             |
| user\_id    | uuid      | 用户 ID，关联 auth.users |
| type        | text      | 纸条类型（见下方枚举）         |
| content     | text      | 纸条内容                |
| ai\_reply     | text      | ai回复               |
| created\_at | timestamp | 创建时间                |

**type 枚举：**

* `goodnight` → 晚安
* `gratitude` → 感恩
* `emotion` → 情绪
* `thought` → 思考

---

#### 2. chat 表

| 字段          | 类型        | 说明                        |
| ----------- | --------- | ------------------------- |
| id          | uuid      | 主键，自动生成                   |
| user\_id    | uuid      | 用户 ID，关联 auth.users       |
| role        | text      | 消息角色：`user` / `assistant` |
| message     | text      | 消息内容                      |
| session\_id | uuid      | 可选，会话 ID（分多轮对话用）          |
| created\_at | timestamp | 创建时间                      |

---

### 权限与 RLS

所有表的 RLS 策略：

| 操作     | 策略条件                   |
| ------ | ---------------------- |
| SELECT | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` |
| UPDATE | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` |

前端不需要做额外用户校验，Supabase 自动识别登录用户。

---

### 前端调用示例

#### 1. 初始化 Supabase

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

#### 2. notes 表：插入与查询

```ts
// 插入纸条
await supabase.from('notes').insert([{ type: 'gratitude', content: '今天很开心！' }]);

// 查询我的纸条
const { data } = await supabase.from('notes')
  .select('*')
  .order('created_at', { ascending: false });
```

---

#### 3. chat 表：插入与查询

```ts
// 插入聊天消息
await supabase.from('chat').insert([{ role: 'user', message: '你好，泡泡！' }]);

// 查询聊天记录
const { data } = await supabase.from('chat')
  .select('*')
  .order('created_at', { ascending: true });
```

---

## DeepSeek AI 对接说明

前端需要与 **DeepSeek AI** 接口通信，用于生成回复消息或情绪分析结果。

---

### API 基本配置

* **基础 URL**: `https://api.deepseek.com/v1/chat/completions`
* **认证方式**: `Bearer Token`
* **Header 示例**

```http
POST /v1/chat/completions
Authorization: Bearer <DEEPSEEK_API_KEY>
Content-Type: application/json
```

---

### 消息流与角色

DeepSeek AI 遵循 OpenAI 风格的 Chat API：

| 角色          | 说明          |
| ----------- | ----------- |
| `system`    | 系统提示，设定对话风格 |
| `user`      | 用户输入        |
| `assistant` | AI 回复       |

前端将用户消息与历史上下文一并发送，AI 返回最新回复。

---

### 调用示例

```ts
async function callDeepSeek(messages) {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

// 示例：传入消息数组
const reply = await callDeepSeek([
  { role: 'system', content: '你是一个温暖的聊天伙伴，语气轻松友好' },
  { role: 'user', content: '今天有点不开心' }
]);
```

---

### 错误处理与最佳实践

* **网络失败**：提示“请检查网络连接”
* **API 超时**：建议前端做 10 秒超时保护
* **日志**：只在本地或后端记录错误信息，避免在 UI 上暴露过多细节
* **重试机制**：失败后可在前端发起 1-2 次重试

---

## 前端整体调用流程

1. 用户发送消息 → 前端 `chat.insert` 存储用户消息
2. 调用 DeepSeek AI → 获取 AI 回复
3. 将 AI 回复存入 `chat` 表 → role=`assistant`
4. 前端实时渲染聊天记录

---

我可以直接帮你把这个文档整理成一个 **完整的 Markdown 文件**，前端团队直接拷贝到仓库就能用。

你希望我现在就把它生成 Markdown 文件，还是想先加上 **ER 图 + 接口流程图** 一起输出？
