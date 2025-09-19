import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export default function TopBar({
  title,
  showBack = false,
  onBack,
  rightAction,
  className
}: TopBarProps) {
  return (
    <div className={cn("flex items-center justify-between h-14 px-4 bg-white border-b", className)}>
      {/* 左侧：返回按钮或标题 */}
      <div className="flex items-center flex-1">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        )}
      </div>

      {/* 右侧操作按钮 */}
      <div className="flex items-center">
        {rightAction || (
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}