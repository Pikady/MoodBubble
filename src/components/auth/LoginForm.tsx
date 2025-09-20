"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from '@/lib/supabase/client';

interface LoginFormProps {
  title?: string;
  description?: string;
  redirectPath?: string;
  showDemoAccount?: boolean;
  className?: string;
}

export default function LoginForm({
  title = "欢迎来到情绪泡泡",
  description = "登录你的账号开始记录心情",
  redirectPath = "/home",
  showDemoAccount = true,
  className = ""
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("登录成功！");
        console.log("登录成功，用户信息:", data.user);

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.push(redirectPath);
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
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
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

        {showDemoAccount && (
          <>
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
                示例账号：user@example.com<br/>
                示例密码：123456
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}