# 登录页面设置指南

## 🚧 当前问题
由于Supabase配置问题，部分登录页面暂时无法正常显示。需要进行以下设置：

## 🔄 新的路由结构

- **首页** (`/`) - 登录页面
- **主页** (`/home`) - 原来的首页内容，需要登录后访问
- **登录页面** (`/auth/login`) - 专门的登录页面
- **演示登录** (`/auth/demo`) - 演示用登录页面
- **简化登录** (`/auth/simple`) - 不依赖复杂组件的登录页面

## 🔧 解决方案

### 1. 配置Supabase
编辑 `.env.local` 文件，设置正确的Supabase配置：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. 启用Supabase认证
在Supabase Dashboard中：
1. 进入 Authentication > Providers
2. 启用 Email provider
3. 配置网站URL

### 3. 创建数据库表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);
```

## 📱 登录页面特点

### 设计特点
- 移动端优先设计
- 使用AppShell和TopBar组件
- 包含CharacterBubble角色形象
- 响应式布局
- 44px触控目标

### 功能特点
- 邮箱密码验证
- 加载状态显示
- 错误处理和Toast提示
- 类型安全的TypeScript实现
- 登录成功后跳转到 `/home` 页面
- 主页包含登出功能

## 📁 文件结构

```
src/
├── app/
│   ├── page.tsx                    # 首页（登录页面）
│   ├── home/page.tsx               # 主页（原来首页内容）
│   ├── auth/
│   │   ├── login/page.tsx          # 登录页面
│   │   ├── demo/page.tsx           # 演示登录页面
│   │   ├── simple/page.tsx         # 简化登录页面
│   │   └── actions/auth.ts         # 登录Server Actions
│   └── api/
│       ├── auth/
│       │   └── login/route.ts       # 登录API路由
│       └── health/route.ts         # 健康检查API
├── components/
│   ├── ui/
│   │   ├── input.tsx               # 输入组件
│   │   └── PaperEntry.tsx          # 纸条入口组件
│   └── layout/
│       └── AppShell.tsx            # 应用布局组件
└── lib/
    └── supabase.ts                 # Supabase配置
```

## 🔄 测试方法

### 方法1：使用首页登录
1. 启动开发服务器：`pnpm dev`
2. 访问：`http://localhost:3000`（首页已改为登录页面）
3. 输入任意邮箱和密码
4. 点击"登录"按钮，成功后会跳转到 `/home`

### 方法2：使用演示页面
1. 启动开发服务器：`pnpm dev`
2. 访问：`http://localhost:3000/auth/simple`
3. 输入任意邮箱和密码
4. 点击"登录"按钮

### 方法3：配置Supabase后使用真实登录
1. 按照上述步骤配置Supabase
2. 访问：`http://localhost:3000/auth/login`
3. 使用真实账号登录

### 方法4：直接访问主页
1. 访问：`http://localhost:3000/home`
2. 点击右上角登出按钮返回登录页

## 📝 注意事项

1. **环境变量**：确保`.env.local`文件中的Supabase配置正确
2. **数据库**：需要创建相应的数据库表和RLS策略
3. **认证**：确保Supabase的Email认证已启用
4. **网络**：确保可以访问Supabase服务

## 🔗 相关链接

- [Supabase Dashboard](https://app.supabase.com/)
- [Supabase Auth文档](https://supabase.com/docs/guides/auth)
- [Next.js Auth文档](https://nextjs.org/docs/app/building-your-application/authentication)