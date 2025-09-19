import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Note, NoteType } from '@/lib/types';
import { NOTE_CONFIG } from '@/lib/noteConfig';
import { formatRelativeTime } from '@/lib/date';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  highlight?: boolean;
  showAIReply?: boolean;
  className?: string;
}

export default function NoteCard({
  note,
  highlight = false,
  showAIReply = true,
  className
}: NoteCardProps) {
  const config = NOTE_CONFIG[note.type];

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        config.cardBg,
        highlight && "border-2 border-yellow-400 bg-yellow-50 shadow-lg",
        !highlight && `border-l-4 ${config.color.replace('text', 'border')}`,
        className
      )}
    >
      <CardContent className="p-4">
        {/* 高亮标识 */}
        {highlight && (
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🌟</span>
            <span className="text-sm font-medium text-yellow-800">最新纸条</span>
          </div>
        )}

        {/* 纸条内容 */}
        <p className="text-gray-800 mb-3 leading-relaxed">
          {note.content}
        </p>

        {/* AI回复 */}
        {showAIReply && note.ai_reply && (
          <div className="bg-white/50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">💭 泡泡回复：</span>
              {note.ai_reply}
            </p>
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className={cn("font-medium", config.color)}>
            {config.label}
          </span>
          <span>
            {formatRelativeTime(note.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}