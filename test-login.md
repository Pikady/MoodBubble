# 登录页面测试指南

## 访问登录页面
1. 启动开发服务器: `pnpm dev`
2. 访问: http://localhost:3005/auth/login

## 功能特点
- 移动端优先设计
- 使用AppShell和TopBar组件
- 包含CharacterBubble角色形象
- 邮箱密码表单验证
- 使用Supabase认证
- 错误处理和Toast提示
- 响应式布局

## 依赖文件
- `src/app/auth/login/page.tsx` - 登录页面
- `src/app/actions/auth.ts` - 登录Server Action
- `src/app/api/auth/login/route.ts` - 登录API路由
- `src/components/ui/input.tsx` - 输入组件
- `src/lib/supabase.ts` - Supabase配置

## 数据库要求
需要Supabase数据库包含以下表：
- `users` (id, email, created_at)