"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AppShell from "@/components/layout/AppShell";
import CharacterBubble from "@/components/mascot/CharacterBubble";

export default function DemoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 模拟登录成功
      toast.success("演示登录成功！");

      // 模拟跳转到主页
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("登录错误:", error);
      toast.error(error instanceof Error ? error.message : "登录失败");
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
        {/* 角色形象 */}
        <div className="mb-8">
          <CharacterBubble
            size={200}
            mood="idle"
            showThoughts={false}
          />
        </div>

        {/* 登录卡片 */}
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              演示登录
            </CardTitle>
            <CardDescription>
              这是一个演示登录页面，不需要真实账号
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
                  placeholder="请输入任意邮箱"
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
                  placeholder="请输入任意密码"
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
                {isLoading ? "登录中..." : "演示登录"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                这是一个演示页面，{" "}
                <button
                  onClick={() => router.push("/auth/login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  查看真实登录页面
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}