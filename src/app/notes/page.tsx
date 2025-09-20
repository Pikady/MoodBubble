"use client";

import TopBar from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { NOTE_CONFIG, getNotesByTypeOrder } from '@/lib/noteConfig';
import { formatRelativeTime } from '@/lib/date';
import { Plus, FileText } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useRouter } from 'next/navigation';

function NotesContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const { notes, isLoading } = useNotes();
  const router = useRouter();

  return (
    <AppShell  showBack onBack={() => router.back()}>

      <div className="p-4 space-y-6">
        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        )}

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
        {!isLoading && getNotesByTypeOrder().map((type) => {
          const config = NOTE_CONFIG[type];
          const typeNotes = notes.filter(note => note.type === type);

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
        {!isLoading && notes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有纸条
            </h3>
            <p className="text-gray-500 mb-4">
              开始写你的第一张纸条吧！
            </p>
            <Button onClick={() => router.push('/notes/new')}>
              写纸条
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ClipBoxContent />
    </Suspense>
  );
}