# 情绪泡泡 (Mood Bubble)

一个温暖的移动端应用，让你可以记录心情、写纸条、与AI聊天。

## 技术栈

- **Frontend**: Next.js 15+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: framer-motion
- **State Management**: SWR + Zustand
- **Backend**: Supabase (Auth + Database)
- **AI**: OpenAI API Integration

## 功能特性

### 🫧 核心功能
1. **首页**: 吉祥物展示 + 快速入口
2. **聊天**: 与AI情绪伙伴自由对话
3. **纸条**: 四种类型纸条（晚安、感恩、情绪、思考）
4. **纸条盒**: 按类型分组展示所有纸条

### 📱 移动端优化
- 44px 触控目标尺寸
- 安全区适配
- 软键盘友好
- 响应式设计

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境配置

复制环境变量文件：

```bash
cp .env.example .env.local
```

配置必要的环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI 配置
OPENAI_API_KEY=your_openai_api_key

# 应用配置
NEXT_PUBLIC_APP_NAME=情绪泡泡
```

### 3. 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/ai/chat/       # AI 聊天 API
│   ├── chat/              # 聊天页面
│   ├── notes/             # 纸条相关页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   ├── common/           # 通用组件
│   ├── compose/          # 输入组件
│   ├── mascot/           # 吉祥物组件
│   ├── notes/            # 纸条组件
│   └── ui/               # UI 基础组件
├── lib/                  # 工具库
│   ├── supabase/         # Supabase 配置
│   ├── types.ts          # TypeScript 类型
│   ├── noteConfig.ts     # 纸条配置
│   └── utils.ts          # 工具函数
├── hooks/               # React Hooks
└── app/actions/         # Server Actions
```

## 开发指南

### 页面开发流程

1. **首页** (`/`) → **对话页** (`/chat`)
2. **选类型页** (`/notes/new`) → **写纸条页** (`/notes/new/[type]`)
3. **提交后** → **纸条盒** (`/notes?highlight={id}`)

### 组件开发约定

- 使用 TypeScript 严格模式
- 移动端优先，触控目标 ≥ 44px
- 遵循现有的设计系统和组件规范
- 保持组件单一职责原则

### 状态管理

- **客户端状态**: SWR（数据获取）+ 本地 state
- **服务端状态**: Server Actions（写操作）
- **全局状态**: Zustand（如需要）

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 其他平台

支持所有兼容 Next.js 的部署平台。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
