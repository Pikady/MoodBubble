"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import { MessageSquare, Plus } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <AppShell
      right={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/notes/new')}
        >
          <Plus className="h-5 w-5" />
        </Button>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* 吉祥物和思维泡泡占位 */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mb-8 flex items-center justify-center">
          <span className="text-4xl">🫧</span>
        </div>

        {/* 思维泡泡 */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-8 max-w-xs text-center shadow-sm">
          <p className="text-gray-600 text-sm">
            你好！我是你的情绪小伙伴~ 💭
          </p>
        </div>

        {/* 输入框 */}
        <div className="w-full max-w-md">
          <Button
            variant="outline"
            className="w-full h-11 text-left justify-start text-gray-500"
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
