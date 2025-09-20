import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PaperEntry from '@/components/ui/PaperEntry';

interface TopBarProps {
  // 左侧控制
  showLeft?: boolean;
  leftContent?: React.ReactNode;

  // 中间控制
  centerContent?: React.ReactNode;
  title?: string;

  // 右侧控制
  showRight?: boolean;
  rightContent?: React.ReactNode;

  // 便捷功能
  showBack?: boolean;
  onBack?: () => void;

  // 特殊功能
  showPaperEntry?: boolean;

  className?: string;
}

export default function TopBar({
  showLeft = true,
  leftContent,
  centerContent,
  title,
  showRight = true,
  rightContent,
  showBack = false,
  onBack,
  showPaperEntry = false,
  className
}: TopBarProps) {
  const router = useRouter();

  // 左侧内容
  const leftSection = showLeft ? (
    <div className="flex items-center">
      {leftContent || (
        <>
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
          {title && !centerContent && (
            <h1 className="text-lg font-semibold text-foreground truncate">
              {title}
            </h1>
          )}
        </>
      )}
    </div>
  ) : null;

  // 中间内容
  const centerSection = centerContent || (!showLeft && title && (
    <h1 className="text-lg font-semibold text-foreground truncate">
      {title}
    </h1>
  )) || (showPaperEntry && (
    <div className="flex items-center justify-center">
      <PaperEntry />
    </div>
  ));

  // 右侧内容
  const rightSection = showRight ? (
    <div className="flex items-center">
      {rightContent}
    </div>
  ) : null;

  return (
    <div className={cn("flex items-center justify-between h-14 px-4 bg-white border-b", className)}>
      {/* 左侧区域 */}
      {leftSection && (
        <div className="flex items-center flex-1">
          {leftSection}
        </div>
      )}

      {/* 中间区域 */}
      {centerSection && (
        <div className="flex items-center flex-1">
          {centerSection}
        </div>
      )}

      {/* 右侧区域 */}
      {rightSection && (
        <div className="flex items-center flex-1 justify-end">
          {rightSection}
        </div>
      )}
    </div>
  );
}