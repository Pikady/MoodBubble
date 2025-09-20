"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import LoginForm from "@/components/auth/LoginForm";
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已经登录
    const checkUserSession = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          const client = createClient(supabaseUrl, supabaseAnonKey);
          const { data: { session }, error } = await client.auth.getSession();
          if (session) {
            // 用户已登录，直接跳转到主页
            router.push("/home");
          }
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
