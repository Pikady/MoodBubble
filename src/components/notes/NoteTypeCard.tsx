import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NOTE_CONFIG } from '@/lib/noteConfig';
import { NoteType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NoteTypeCardProps {
  type: NoteType;
  title?: string;
  accent?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function NoteTypeCard({
  type,
  title,
  accent,
  href,
  onClick,
  className
}: NoteTypeCardProps) {
  const config = NOTE_CONFIG[type];
  const displayTitle = title || config.label;

  const getIcon = () => {
    switch (type) {
      case 'goodnight':
        return '🌙';
      case 'gratitude':
        return '🙏';
      case 'emotion':
        return '💭';
      case 'reflection':
        return '🤔';
      default:
        return '📝';
    }
  };

  const content = (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-2 border-transparent hover:border-gray-300",
        config.cardBg,
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className={cn("text-lg font-semibold mb-2", config.color)}>
              {displayTitle}
            </h3>
            <p className="text-sm text-gray-600">
              {config.prompt}
            </p>
          </div>
          <div className="text-3xl opacity-50">
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}