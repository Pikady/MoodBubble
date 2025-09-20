"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import LoginForm from "@/components/auth/LoginForm";
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已经登录
    const checkUserSession = async () => {
      try {
        console.log("首页检查用户会话...");
        const client = createClient();
        const { data: { user }, error } = await client.auth.getUser();
        console.log("首页用户检查结果:", { user, error });

        if (user) {
          console.log("用户已登录，跳转到主页");
          // 用户已登录，直接跳转到主页
          router.push("/home");
        }
      } catch (error) {
        console.error("检查用户会话失败:", error);
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <AppShell
      showPaperEntry={false}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
        <LoginForm />
      </div>
    </AppShell>
  );
}
