"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import CharacterBubble from '@/components/mascot/CharacterBubble';
import { MessageSquare, Plus } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <AppShell>
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
        <div className="w-full max-w-md" style={{ position: 'relative', top: '200px' }}>
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
