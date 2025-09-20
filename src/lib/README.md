# 后端接口使用说明

## 概述

本项目已完成与Supabase和DeepSeek AI的后端接口集成，包括：

1. **Supabase客户端配置** - 客户端和服务端配置
2. **数据库操作** - notes和chat表的完整CRUD操作
3. **AI服务集成** - DeepSeek AI接口调用和流式响应
4. **React Hooks** - 客户端数据管理hooks

## 文件结构

```
src/
├── lib/
│   ├── supabase.ts          # Supabase客户端配置
│   ├── types.ts             # 类型定义
│   └── services/
│       └── ai.ts            # AI服务接口
├── app/
│   ├── actions/
│   │   ├── notes.ts         # 笔记相关Server Actions
│   │   ├── chat.ts          # 聊天相关Server Actions
│   │   └── notes-with-ai.ts # 笔记+AI集成
│   └── api/
│       └── ai/
│           └── chat/
│               └── route.ts # AI聊天API路由
└── hooks/
    ├── useNotes.ts          # 笔记管理hook
    └── useChat.ts           # 聊天功能hook
```

## 使用方法

### 1. 环境变量配置

复制 `.env.example` 到 `.env.local` 并配置：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI配置
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 2. 在组件中使用hooks

#### 笔记管理
```tsx
import { useNotes } from '@/hooks/useNotes';

function MyComponent() {
  const { notes, createNote, updateNote, deleteNote, isLoading } = useNotes();

  const handleCreateNote = async () => {
    await createNote({
      type: 'gratitude',
      content: '今天很感恩...'
    });
  };

  return (
    <div>
      {notes.map(note => (
        <div key={note.id}>
          {note.content}
        </div>
      ))}
    </div>
  );
}
```

#### 聊天功能
```tsx
import { useChat } from '@/hooks/useChat';

function ChatComponent() {
  const { messages, sendMessage, isLoading } = useChat();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, (chunk) => {
      // 处理流式响应
      console.log('AI回复:', chunk);
    });
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}
```

### 3. 使用Server Actions

#### 创建笔记并获取AI回复
```tsx
'use server';

import { createNoteWithAI } from '@/app/actions/notes-with-ai';

async function handleCreateNote() {
  const result = await createNoteWithAI({
    type: 'emotion',
    content: '今天感觉有点焦虑...'
  });

  console.log('笔记ID:', result.noteId);
  console.log('AI回复:', result.aiReply);
}
```

### 4. 直接调用AI API

```tsx
// 流式调用
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '你好，泡泡！' }
    ]
  })
});

// 处理流式响应
const reader = response.body?.getReader();
// ... 处理流式数据
```

## API接口

### 笔记相关

- `createNote(params)` - 创建笔记
- `getUserNotes()` - 获取用户所有笔记
- `getNotesByType(type)` - 获取指定类型的笔记
- `updateNote(id, content)` - 更新笔记
- `deleteNote(id)` - 删除笔记

### 聊天相关

- `createChatMessage(params)` - 创建聊天消息
- `getUserChatMessages(sessionId)` - 获取聊天消息
- `getRecentChatHistory(limit)` - 获取最近聊天历史
- `clearUserChatHistory(sessionId)` - 清空聊天记录

### AI集成

- `callDeepSeekAI(request)` - 调用DeepSeek AI
- `streamDeepSeekAI(request)` - 流式调用
- `createNoteWithAI(params)` - 创建笔记并获取AI回复

## 特性

1. **类型安全** - 完整的TypeScript类型定义
2. **错误处理** - 统一的错误处理机制
3. **缓存管理** - 使用SWR进行客户端缓存
4. **流式响应** - 支持AI回复的实时流式显示
5. **权限控制** - 基于Supabase RLS的数据权限
6. **移动端优化** - 适配移动端的使用场景

## 下一步

1. 配置Supabase数据库表结构
2. 测试所有API接口
3. 集成到前端页面中
4. 添加错误边界和加载状态
5. 实现离线缓存功能