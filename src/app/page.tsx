"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // 初始化Supabase客户端
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);

      // 检查用户是否已经登录
      checkUserSession(client);
    }
  }, []);

  const checkUserSession = async (client: any) => {
    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (session) {
        // 用户已登录，直接跳转到主页
        router.push("/home");
      }
    } catch (error) {
      console.error("检查用户会话失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!supabase) {
        throw new Error("Supabase客户端未初始化");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("登录成功！");

        // 检查用户是否存在于users表中
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (checkError && checkError.code === 'PGRST116') {
          // 用户不存在，创建新用户记录
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                created_at: new Date().toISOString(),
              }
            ]);

          if (insertError) {
            console.error("创建用户记录失败:", insertError);
          }
        }

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      }
    } catch (error: any) {
      console.error("登录错误:", error);
      toast.error(error.message || "登录失败，请检查邮箱和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell
      showPaperEntry={false}
      className="bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">

        {/* 登录卡片 */}
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              欢迎来到情绪泡泡
            </CardTitle>
            <CardDescription>
              登录你的账号开始记录心情
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账号？{" "}
                <button
                  onClick={() => router.push("/auth/register")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  立即注册
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => {
                    setEmail('someone@email.com');
                    setPassword('XaXIlMdAWdTVvJSORPEf');
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  填入示例账号
                </button>
              </p>
            </div>

            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                示例账号：someone@email.com<br/>
                示例密码：XaXIlMdAWdTVvJSORPEf
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
