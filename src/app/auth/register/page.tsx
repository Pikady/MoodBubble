"use client";

import AppShell from "@/components/layout/AppShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AppShell
      showPaperEntry={false}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
        <RegisterForm
          title="创建账号"
          description="注册你的情绪泡泡账号"
        />
      </div>
    </AppShell>
  );
}