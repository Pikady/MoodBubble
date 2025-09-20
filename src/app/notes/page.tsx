"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { NOTE_CONFIG, getNotesByTypeOrder } from '@/lib/noteConfig';
import { formatRelativeTime } from '@/lib/date';
import { Plus, FileText } from 'lucide-react';

// 模拟数据
const mockNotes = [
  {
    id: '1',
    type: 'gratitude' as const,
    content: '今天和朋友一起吃饭很开心，感谢他们的陪伴！',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ai_reply: '听起来很美好！友谊就是生活中最珍贵的礼物之一 🌟'
  },
  {
    id: '2',
    type: 'emotion' as const,
    content: '工作压力有点大，感觉需要好好休息一下。',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ai_reply: '辛苦了！记得劳逸结合，给自己一些放松的时间 💙'
  },
  {
    id: '3',
    type: 'thought' as const,
    content: '今天学到了新东西，感觉每天都在成长。',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ai_reply: '保持学习的热情是很棒的习惯！继续加油 📚✨'
  }
];

function NotesContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  return (
    <AppShell
      topBar={
        <TopBar
          title="我的纸条盒"
          rightContent={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {}}
            >
              <Plus className="h-5 w-5" />
            </Button>
          }
        />
      }
    >
      <div className="p-4 space-y-6">
        {/* 高亮卡片 */}
        {highlightId && (
          <Card className="border-2 border-yellow-400 bg-yellow-50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🌟</span>
                <span className="text-sm font-medium text-yellow-800">最新纸条</span>
              </div>
              <p className="text-gray-800 mb-2">
                这是一张新创建的纸条内容
              </p>
              <p className="text-sm text-gray-600">
                刚刚
              </p>
            </CardContent>
          </Card>
        )}

        {/* 按类型分组的纸条 */}
        {getNotesByTypeOrder().map((type) => {
          const config = NOTE_CONFIG[type];
          const typeNotes = mockNotes.filter(note => note.type === type);

          if (typeNotes.length === 0) return null;

          return (
            <div key={type}>
              <h3 className={`text-lg font-semibold ${config.color} mb-3`}>
                {config.label}
              </h3>
              <div className="space-y-3">
                {typeNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={`${config.cardBg} border-l-4 ${config.color.replace('text', 'border')} transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      <p className="text-gray-800 mb-3">
                        {note.content}
                      </p>
                      {note.ai_reply && (
                        <div className="bg-white/50 rounded-lg p-3 mb-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">💭 泡泡回复：</span>
                            {note.ai_reply}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(note.created_at)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {/* 空状态 */}
        {mockNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有纸条
            </h3>
            <p className="text-gray-500 mb-4">
              开始写你的第一张纸条吧！
            </p>
            <Button onClick={() => {}}>
              写纸条
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <NotesContent />
    </Suspense>
  );
}