"use client";

import AppShell from "@/components/layout/AppShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AppShell
      showPaperEntry={false}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
        <LoginForm
          title="欢迎回来"
          description="登录你的情绪泡泡账号"
          showDemoAccount={false}
        />
      </div>
    </AppShell>
  );
}