"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { NOTE_CONFIG } from '@/lib/noteConfig';
import { NoteType } from '@/lib/types';
import { ArrowLeft, Send } from 'lucide-react';

export default function WriteNotePage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = params.type as NoteType;
  const config = NOTE_CONFIG[type];
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!config) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">纸条类型不存在</h1>
            <Button onClick={() => router.push('/notes/new')}>
              返回选择
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    // 模拟提交过程
    setTimeout(() => {
      const noteId = Math.random().toString(36).substr(2, 9);
      setIsLoading(false);
      router.push(`/notes?highlight=${noteId}`);
    }, 1500);
  };

  return (
    <AppShell
      left={
        <TopBar
          showBack
          onBack={() => router.back()}
          title={`写${config.label}`}
        />
      }
    >
      <div className="flex flex-col h-full">
        {/* 提示卡片 */}
        <div className="p-4">
          <Card className={`${config.cardBg} border-l-4 ${config.color.replace('text', 'border')}`}>
            <CardContent className="p-4">
              <p className={`text-sm font-medium ${config.color}`}>
                {config.prompt}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 写作区域 */}
        <div className="flex-1 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里写下你的想法..."
            className="w-full h-full min-h-[200px] p-4 border border-input rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* 底部操作栏 */}
        <div className="sticky bottom-0 bg-white border-t p-4 safe-area-bottom">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {content.length} 字
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="h-11 px-6"
            >
              {isLoading ? '提交中...' : '发送纸条'}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}