import React from 'react';
import { cn } from '@/lib/utils';

interface CharacterBubbleProps {
  size?: number;
  mood?: 'idle' | 'typing' | 'thinking';
  className?: string;
}

export default function CharacterBubble({
  size = 128,
  mood = 'idle',
  className
}: CharacterBubbleProps) {
  const getMoodEmoji = () => {
    switch (mood) {
      case 'typing':
        return '✍️';
      case 'thinking':
        return '🤔';
      default:
        return '🫧';
    }
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'typing':
        return 'from-blue-200 to-purple-200';
      case 'thinking':
        return 'from-amber-200 to-orange-200';
      default:
        return 'from-purple-200 to-pink-200';
    }
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg",
        getMoodColor(),
        className
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="select-none"
        style={{ fontSize: size * 0.375 }}
      >
        {getMoodEmoji()}
      </span>
    </div>
  );
}