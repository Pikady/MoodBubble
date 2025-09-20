import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Note, NoteType } from '@/lib/types';
import { NOTE_CONFIG } from '@/lib/noteConfig';
import { cn } from '@/lib/utils';
import NoteBoxContent from '@/components/notebox/NoteBoxContent';

interface NoteBoxCardProps {
  type: NoteType,
  notes: Note[],
  highlight?: boolean;
  showAIReply?: boolean;
  className?: string;
  style?: object;
  onClick?: () => void;
}

const labelBgDict = {
  gratitude:  { background: 'radial-gradient(circle 8px at top, transparent 8px, #D2ECBF)', right: "30px"},
  goodnight:  { background: 'radial-gradient(circle 8px at top, transparent 8px, #B9B6FF)', right: "60px"},
  thought: { background: 'radial-gradient(circle 8px at top, transparent 8px, #FFF9B6)', right: "90px"},
  emotion:    { background: 'radial-gradient(circle 8px at top, transparent 8px, #B8EFFB)', right: "120px"},
}

export default function NoteBoxCard({
  type,
  notes,
  highlight = false,
  showAIReply = true,
  className,
  style,
  onClick
}: NoteBoxCardProps) {
  const config = NOTE_CONFIG[type];

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md h-screen rounded-[30px]",
        config.cardBg,
        highlight && "border-2 border-yellow-400 bg-yellow-50 shadow-lg",
        !highlight && `border-l-4 ${config.color.replace('text', 'border')}`,
        className
      )}
      style={style}
      onClick={onClick}
    >
      <CardContent className="p-4 relative overflow-visible">
        {/* 高亮标识 */}
        {highlight && (
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🌟</span>
            <span className="text-sm font-medium text-yellow-800">最新纸条</span>
          </div>
        )}

        {/* 纸条盒类型 */}
        <div className={cn(
          "inline-block text-sm px-4 py-1 mb-2 rounded-[40px] text-gray-800",
          config.labelBg
        )}>
          {config.label}
        </div>

        <NoteBoxContent notes={notes}></NoteBoxContent>

        <div style={{ background: labelBgDict[type].background, right: labelBgDict[type].right }}
          className="absolute top-[-20px] w-5 h-8 border-1 border-white rounded-b-lg" ></div>
      </CardContent>
    </Card>
  );
}