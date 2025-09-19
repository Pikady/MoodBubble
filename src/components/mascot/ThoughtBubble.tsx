import React from 'react';
import { cn } from '@/lib/utils';

interface ThoughtBubbleProps {
  icon?: React.ReactNode;
  float?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function ThoughtBubble({
  icon,
  float = false,
  className,
  children
}: ThoughtBubbleProps) {
  return (
    <div
      className={cn(
        "relative bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm",
        float && "animate-float",
        className
      )}
    >
      {/* 思维泡泡的小尾巴 */}
      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r-2 border-b-2 border-gray-200 rotate-45"></div>

      <div className="relative z-10">
        {icon && (
          <div className="flex items-center justify-center mb-2">
            {icon}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}