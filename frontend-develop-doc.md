# 概览

面向移动端优先的“情绪泡泡”应用前端开发文档。技术栈：

* **Next.js 14+（App Router）** + **TypeScript**
* **Tailwind CSS** + **shadcn/ui**（Radix Primitives）
* **framer-motion**（轻动效）、**vaul**（Bottom Sheet）、**embla-carousel**（可选）
* **Supabase**（认证 + 数据存储 + RLS）
* **Edge Route** 代理 AI（/api/ai/chat）

> 视觉基线：移动端优先、44px 触控尺寸、安全区适配、轻卡片+插画。

---

# 0. 需求闭环与范围

**用户流（对应 7 张图）：**

1. 首页：吉祥物+思维泡泡+底部“泡泡我跟你说”输入 → 跳 **对话页** `/chat`。
2. 对话页：与泡泡自由聊天（非纸条流程）。
3. 选类型页：四种纸条 + 纸条盒按钮 `/notes/new`。
4. 写纸条页：四种类型仅“颜色+引导词”不同 `/notes/new/[type]`。
5. 提交后展示：跳转 `/notes?highlight={id}`，顶部高亮最新卡片（颜色随类型）。
6. 纸条盒：按类型分组 `/notes`，与第三张四色一致。

**MVP 范围：**

* 登录（Supabase Auth 内置 Email/OTP 任一）
* 纸条 CRUD、AI 回复回填
* 对话会话/消息基本流式聊天
* 本地化（中文）与基础无障碍

---

# 1. 路由结构与页面职责

```
app/
  layout.tsx                    // 全局样式与字体
  page.tsx                      // ① 首页
  chat/page.tsx                 // ② 对话页（自由聊天）
  notes/
    page.tsx                    // ⑦ 纸条盒（承载 ⑥ 高亮卡片）
    new/page.tsx                // ③ 选类型
    new/[type]/page.tsx         // ④/⑤ 写纸条
api/
  ai/chat/route.ts              // AI 代理（Edge+SSE 流式）
```

**导航规则：**

* 首页输入框 `onFocus/onPointerDown → router.push('/chat')`
* 右上按钮 → `/notes/new`
* 选类型点击卡片 → `/notes/new/[type]`
* 写纸条提交 → `/notes?highlight={id}`

---

# 2. 目录与代码组织

```
components/
  layout/AppShell.tsx           // 头部/底部安全区容器
  layout/TopBar.tsx             // 返回/标题/右侧按钮
  common/IconButton.tsx
  common/SectionHeader.tsx
  common/EmptyState.tsx
  compose/TextInputBar.tsx      // 首页/聊天输入条
  compose/NoteComposer.tsx      // 写纸条输入+发送
  mascot/CharacterBubble.tsx
  mascot/ThoughtBubble.tsx
  notes/NoteTypeCard.tsx
  notes/NoteCard.tsx
  notes/NoteGroup.tsx
  notes/NoteList.tsx
  notes/LatestCard.tsx
lib/
  types.ts
  noteConfig.ts                 // 颜色/文案集中定义
  date.ts
  supabase/
    client.ts                   // browser client（RLS）
    server.ts                   // server client（service role 或 cookies）
  ai.ts                         // 服务端 AI 调用封装
hooks/
  useNotes.ts                   // SWR 读取 + mutate
  useKeyboardSpacer.ts
  useScrollRestore.ts
app/actions/
  notes.ts                      // Server Actions（写操作）
  chat.ts                       // 会话/消息写入
```

---

# 3. 设计系统与主题（配置驱动）

```ts
export type NoteType = 'goodnight'|'gratitude'|'emotion'|'reflection';

export const NOTE_CONFIG: Record<NoteType, {
  label: string;
  color: string;     // 文本/强调色（如 'text-violet-700'）
  cardBg: string;    // 卡片底色（如 'bg-violet-100'）
  prompt: string;    // 写纸条页顶部引导文案
  order: number;     // 分组排序
}> = {
  goodnight:  { label: '晚安纸条', color:'text-violet-700', cardBg:'bg-violet-100',  prompt:'今天过得怎么样？写点晚安心事吧~', order:2 },
  gratitude:  { label: '感恩纸条', color:'text-green-700',  cardBg:'bg-green-100',   prompt:'记录你今天觉得开心/感恩的小瞬间！', order:1 },
  reflection: { label: '思考纸条', color:'text-amber-700',  cardBg:'bg-amber-100',   prompt:'今天有什么想法/反思？留给未来的你~', order:3 },
  emotion:    { label: '情绪纸条', color:'text-sky-700',    cardBg:'bg-sky-100',     prompt:'你现在的感觉是什么？写下来会轻松些~', order:4 },
};
```

> 改文案或配色只需改此处，第三/四/五/六/七张图联动更新。

Tailwind 约定：触控区 `h-11`（44px），圆角 `rounded-2xl`，阴影适度 `shadow-sm`，避免重模糊。

---

# 4. 组件清单与 Props 合约

## 4.1 布局与基础

* **AppShell**

  * `props: { left?: ReactNode; right?: ReactNode; children: ReactNode }`
  * 自动处理 `pb-[env(safe-area-inset-bottom)]` 与滚动容器。
* **TopBar**

  * 左：返回；右：入口按钮（“泡泡纸条”/“纸条盒”）。

## 4.2 首页/可爱元素

* **CharacterBubble** `{ size?: number; mood?: 'idle'|'typing'|'thinking' }`
* **ThoughtBubble** `{ icon?: ReactNode; float?: boolean }`

## 4.3 输入与交互

* **TextInputBar** `{ placeholder: string; onFocus?: () => void; onSubmit?: (text:string)=>void }`
* **NoteComposer** `{ type: NoteType; onSubmit: (text:string)=>Promise<void>|void }`

## 4.4 列表与卡片

* **NoteTypeCard** `{ type: NoteType; title: string; accent?: string; href?: string }`
* **NoteCard** `{ id: string; type: NoteType; content: string; createdAt: string; highlight?: boolean }`
* **LatestCard** `{ noteId: string }`（从全量 notes 里查找并以 `cardBg` 高亮）
* **NoteGroup** `{ title: string; items: Note[] }`
* **NoteList** `{ notes: Note[]; orderByType: NoteType[] }`

---

# 5. 页面骨架（要点）

## 5.1 首页 `/`

* 上方：`CharacterBubble + ThoughtBubble`
* 下方：`TextInputBar`（`onFocus` 跳 `/chat`）
* 右上：按钮跳 `/notes/new`

## 5.2 对话页 `/chat`

* 消息气泡：`Card` 变体（user / assistant）
* 输入：`TextInputBar` → 调 `/api/ai/chat` 流式渲染
* 可选：会话侧栏（后续迭代）

## 5.3 选类型 `/notes/new`

* `NoteTypeCard` ×4（按 `NOTE_CONFIG` 渲染）
* 右上：纸条盒按钮 → `/notes`

## 5.4 写纸条 `/notes/new/[type]`

* 顶部 `PromptCard`：使用 `NOTE_CONFIG[type].cardBg + prompt`
* 底部 `NoteComposer`：提交后 `createNoteWithAI` → push `/notes?highlight={id}`

## 5.5 纸条盒 `/notes`

* 若存在 `highlight`：优先渲染 `LatestCard`（图⑥）
* 下方 `NoteList`：按 `order` 渲染 4 个分组

---

# 6. 数据层对接（Supabase）

## 6.1 表（已在后端文档/SQL 建好）

* `notes`：新增 `ai_reply`、`ai_model`、`ai_latency_ms`、`tokens_*`、`updated_at`
* `chat_sessions` / `chat_messages` + RLS

## 6.2 客户端读（RLS + SWR）

* `useNotes()`：`select * from notes order by created_at desc`（RLS 自动过滤 user）
* 刷新策略：纸条新建后 `mutate()` 或事件驱动刷新

## 6.3 写操作（Server Actions）

* `createNoteWithAI({ type, content })`：

  1. 插入 `notes`
  2. 服务端调用 AI（封装在 `lib/ai.ts`）
  3. 回填 `ai_reply/ai_model/ai_latency_ms`
  4. 返回 `id` & `ai_reply`
* 其他：`deleteNote(id)`、（可选）`updateNote()`

---

# 7. AI 调用（接口层）

## 7.1 统一代理

* `app/api/ai/chat/route.ts`（Edge Runtime + SSE）
* 请求体：`{ messages: {role, content}[], model?: string }`
* 响应：SSE（逐 token）
* 统一：鉴权（基于 Supabase 会话）、限流（IP+user）、埋点

## 7.2 纸条 AI 回复

* Server Action 内部直接调用 `lib/ai.ts` 同步获取短回复（非流式），或调用内部 `/api/ai/chat` 并聚合
* 提示词建议：

  * 以 **关怀+简短** 为主（≤ 60 字）
  * 根据 `type` 选择不同语气模板

---

# 8. 状态管理与副作用

* 轻量方案：**SWR** + 局部 `useState`/`useReducer`
* 写操作：只通过 **Server Actions**（或 `/api`）
* 聊天：SSE 读取 → 在 `/chat` 页维护内存消息列表，并按需落库（会话/消息）

---

# 9. 移动端适配要点

* 触控目标 ≥ 44px（按钮、行项）
* 安全区：`pb-[env(safe-area-inset-bottom)]`、`pt-[env(safe-area-inset-top)]`
* 软键盘：底部输入采用 `sticky bottom-0` + Android 兼容的滚动到视图逻辑
* 手势：Bottom Sheet 用 **vaul**（更跟手）
* 动效：尽量用 `transform`（不会触发布局）

---

# 10. 交互细节（易错点）

* 首页输入框不要真实 `focus` 再跳页，直接跳页避免键盘闪烁
* `/notes/new/[type]` 做 `type` 守卫（非法类型 → 404）
* 提交后 `router.push('/notes?highlight={id}')` 并在 `useEffect` 中滚动至高亮卡片
* 列表为空的空态：提供“去写第一张纸条”按钮
* Toast/错误：统一 `sonner` 提示

---

# 11. 样式与 shadcn/ui 约定

* 自定义 `Button` 变体：`size=md(h-11 px-4)`、`size=icon(h-11 w-11)`
* `Card`：`rounded-2xl shadow-sm p-4`，纸条卡 `rotate-[-2deg]`
* 配色：从 `NOTE_CONFIG.cardBg` 派生，保证四类色彩一致性
* Sheet：移动端默认 `Drawer` 风格（vaul），支持全屏/半屏

---

# 12. 可访问性（A11y）

* 按钮/链接：`aria-label` 清晰
* 颜色对比：文字与底色对比度 ≥ 4.5:1（浅色卡片上的正文使用 `text-zinc-800`）
* 键盘陷阱：Sheet/对话框聚焦管理（Radix 已内置）
* 动效可减：尊重 `prefers-reduced-motion`

---

# 13. 性能与质量

* 按需加载：

  * `dynamic(() => import('framer-motion'), { ssr:false })`
  * 轮播/底部抽屉在使用页再加载
* 图片：`next/image`、SVG inline
* 列表：数据量大时 `@tanstack/react-virtual`
* 监控：后续接入 Sentry（前后端）

---

# 14. 测试清单

## 14.1 单元/组件（Vitest + React Testing Library）

* `NoteComposer`：空内容禁用、提交回调、清空
* `NoteList`：按类型分组与排序
* `LatestCard`：`highlight` 逻辑

## 14.2 集成/端到端（Playwright）

* 流程：`/ → /notes/new → /notes/new/[type] → 提交 → /notes` 高亮
* 移动视口：iPhone 14 视口尺寸
* SSE：聊天页能收到流式增量

---

# 15. 环境变量与配置

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`（仅服务端）
* `OPENAI_API_KEY`
* `NEXT_PUBLIC_APP_NAME="泡泡纸条"`

> CI/CD：Vercel 环境变量分别配置 preview/prod；禁止在浏览器侧打印密钥。

---

# 16. 前后端接口契约（MVP）

## 16.1 Server Actions

* `createNoteWithAI({ type, content }): Promise<{ id: string; ai_reply: string }>`
* `deleteNote({ id }): Promise<void>`

**失败码约定（抛错 message）：**

* `Unauthenticated`、`InvalidType`、`EmptyContent`、`AIUnavailable`

## 16.2 REST（Edge）

* `POST /api/ai/chat` → SSE

  * Req: `{ messages: {role, content}[], model? }`
  * Resp: `text/event-stream`（data: token）

---

# 17. 里程碑计划（建议）

* **M1（1–2 天）**：项目初始化、Tailwind、shadcn、AppShell、路由跑通
* **M2（1–2 天）**：NOTE\_CONFIG、NoteTypeCard/NoteComposer/NoteCard、选型页+写纸条页
* **M3（1 天）**：Supabase Auth/notes 接入、`createNoteWithAI`（AI 先 mock）
* **M4（1 天）**：AI 真实接入、/api/ai/chat 流式、对话页 MVP
* **M5（0.5 天）**：纸条盒分组、高亮、空态与错误处理
* **M6（0.5 天）**：打磨动效与移动适配、测试用例

---

# 18. 开发清单（Checklist）

* [ ] Tailwind 基线：`h-11` 触控、`rounded-2xl`、`shadow-sm`
* [ ] AppShell 安全区与滚动
* [ ] NOTE\_CONFIG 四类配色/文案
* [ ] 首页输入条跳转聊天
* [ ] 选类型 → 写纸条 → 高亮卡片
* [ ] Supabase Auth + RLS 验证
* [ ] Server Actions：`createNoteWithAI`
* [ ] AI 路由 `/api/ai/chat`（Edge+SSE）
* [ ] 错误与 Toast
* [ ] 测试：Playwright e2e，一个移动视口用例

---

# 19. 未来迭代建议

* 纸条检索：全文索引（Postgres tsvector）与情绪标签
* 导出：Markdown/CSV 一键导出分享
* 会话管理：会话列表、重命名、置顶
* 多语言：加入 i18n（`next-intl`）
* 成本监控：AI 调用 `ai_logs` 表 + 仪表盘

---

# 附：关键代码片段（示例）

**NoteComposer（核心交互）**

```tsx
"use client";
import { useState } from 'react';
import { NoteType } from '@/lib/types';

export default function NoteComposer({ type, onSubmit }:{ type: NoteType; onSubmit:(v:string)=>void|Promise<void> }){
  const [v, setV] = useState('');
  const disabled = v.trim().length === 0;
  return (
    <div className="sticky bottom-0 bg-white border-t pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-end gap-2 p-3">
        <textarea value={v} onChange={e=>setV(e.target.value)} placeholder="写点什么吧..."
          className="flex-1 min-h-[44px] max-h-32 resize-none rounded-xl border px-3 py-2"/>
        <button disabled={disabled} onClick={async()=>{if(!disabled){ await onSubmit(v.trim()); setV(''); }}}
          className="h-11 px-4 rounded-full bg-black text-white disabled:opacity-40">发送</button>
      </div>
    </div>
  );
}
```

**NoteList（按类型分组）**

```tsx
import { Note, NoteType } from '@/lib/types';
import NoteGroup from './NoteGroup';

export default function NoteList({ notes, orderByType }:{ notes: Note[]; orderByType: NoteType[] }){
  return (
    <div className="space-y-6">
      {orderByType.map(t=>{
        const items = notes.filter(n=>n.type===t);
        if(items.length===0) return null;
        return <NoteGroup key={t} title={t} items={items}/>;
      })}
    </div>
  );
}
```

**Server Action：createNoteWithAI（伪码）**

```ts
'use server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { aiReply } from '@/lib/ai';

export async function createNoteWithAI({ type, content }:{ type:string; content:string }){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) throw new Error('Unauthenticated');

  const { data: note, error } = await supabase.from('notes')
    .insert({ user_id: user.id, type, content })
    .select('id')
    .single();
  if(error) throw error;

  const started = Date.now();
  const reply = await aiReply(type, content); // 内部调用 OpenAI
  const latency = Date.now() - started;

  await supabase.from('notes')
    .update({ ai_reply: reply, ai_model: 'gpt-4o-mini', ai_latency_ms: latency })
    .eq('id', note.id);

  return { id: note.id as string, ai_reply: reply };
}
```
