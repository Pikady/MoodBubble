"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { NOTE_CONFIG } from '@/lib/noteConfig';
import { NOTE_TYPES } from '@/lib/noteConfig';
import { ArrowLeft, Notebook } from 'lucide-react';

export default function NewNotePage() {
  const router = useRouter();

  return (
    <AppShell
      topBar={
        <TopBar
          showBack
          onBack={() => router.back()}
          title="选择纸条类型"
          rightContent={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/notes')}
            >
              <Notebook className="h-5 w-5" />
            </Button>
          }
        />
      }
    >
      <div className="p-4 space-y-4">
        {NOTE_TYPES.map((type) => {
          const config = NOTE_CONFIG[type];
          return (
            <Card
              key={type}
              className={`cursor-pointer transition-all hover:shadow-md ${config.cardBg} border-2 border-transparent hover:border-gray-300`}
              onClick={() => router.push(`/notes/new/${type}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${config.color} mb-2`}>
                      {config.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {config.prompt}
                    </p>
                  </div>
                  <div className="text-3xl opacity-50">
                    {type === 'goodnight' && '🌙'}
                    {type === 'gratitude' && '🙏'}
                    {type === 'emotion' && '💭'}
                    {type === 'reflection' && '🤔'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}