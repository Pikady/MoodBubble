"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import CharacterBubble from '@/components/mascot/CharacterBubble';
import PaperEntry from '@/components/ui/PaperEntry';
import TopBar from '@/components/layout/TopBar';
import { MessageSquare, Plus, LogOut } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    // 简单的登出逻辑，清除本地存储并跳转到登录页
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    router.push('/');
  };

  return (
    <AppShell
      topBar={
        <TopBar
          showLeft={false}
          rightContent={
            <div className="flex items-center space-x-2">
              <PaperEntry />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9"
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
            className="w-80 h-11 text-left justify-start text-gray-500 ml-5" // 添加ml-auto让按钮向右移动
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