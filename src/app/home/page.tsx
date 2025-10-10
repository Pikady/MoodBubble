"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import CharacterBubble from '@/components/mascot/CharacterBubble';
import PaperEntry from '@/components/ui/PaperEntry';
import TopBar from '@/components/layout/TopBar';
import { MessageSquare, Plus, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      console.log("开始检查用户会话...");
      const supabase = createClient();

      // 使用getUser获取当前用户信息
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      console.log("用户信息获取结果:", { user, error: userError });

      if (userError || !user) {
        console.log("用户未登录，跳转到登录页");
        // 用户未登录，跳转到登录页
        router.push('/');
        return;
      }

      console.log("用户已登录，设置用户状态:", { userId: user.id, email: user.email });

      // 直接使用Supabase用户信息，不需要额外的users表
      setUser({
        id: user.id,
        email: user.email || '',
        createdAt: user.created_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error("检查用户会话失败:", error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("已成功登出");
      router.push('/');
    } catch (error) {
      console.error("登出失败:", error);
      toast.error("登出失败");
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      topBar={
        <TopBar
          showLeft={false}
          centerContent={
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600 truncate max-w-[120px]">
                {user?.email}
              </span>
            </div>
          }
          rightContent={
            <div className="flex items-center space-x-2">
              <PaperEntry />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9"
                title="登出"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          }
        />
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* CharacterBubble with idle mood and thoughts */}
        <div className="mb-8">
          <CharacterBubble
            size={240}
            mood="idle"
            showThoughts={true}
          />
        </div>

        {/* 思维泡泡 */}
        {/* <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-8 max-w-xs text-center shadow-sm">
          <p className="text-gray-600 text-sm">
            你好！我是你的情绪小伙伴~ 💭
          </p>
        </div> */}

        {/* 输入框 */}
        <div className="w-full max-w-md mobile:absolute mobile:bottom-8 mobile:left-1/2 mobile:transform mobile:-translate-x-1/2" style={{ position: 'relative', top: '200px' }}>
          <Button
            variant="outline"
            className="w-80 h-11 text-left justify-start text-gray-500 mx-[auto] w-[100%]" // 添加ml-auto让按钮向右移动
            onClick={() => router.push('/chat')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            泡泡我跟你说...
          </Button>
        </div>
      </div>
    </AppShell>
  );
}