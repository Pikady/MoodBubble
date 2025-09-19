import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showPaperEntry?: boolean;
  className?: string;
}

export default function TopBar({
  title,
  left,
  right,
  showBack = false,
  onBack,
  rightAction,
  showPaperEntry = false,
  className
}: TopBarProps) {
  const router = useRouter();

  return (
    <div className={cn("flex items-center justify-between h-14 px-4 bg-white border-b", className)}>
      {/* 左侧：自定义left或返回按钮或标题 */}
      <div className="flex items-center flex-1">
        {left || (
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
            {title && (
              <h1 className="text-lg font-semibold text-foreground truncate">
                {title}
              </h1>
            )}
          </>
        )}
      </div>

      {/* 中间：PaperEntry按钮 */}
      {showPaperEntry && (
        <div className="flex items-center mx-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/notes/new')}
            className="bg-[#121210] text-white hover:bg-gray-800 rounded-full px-4 py-2 h-9 text-sm font-medium"
          >
            <img
              src="/images/mascot/edit-icon.svg"
              alt="编辑"
              className="w-4 h-4 mr-2"
            />
            泡泡纸条
          </Button>
        </div>
      )}

      {/* 右侧：自定义right或默认操作按钮 */}
      <div className="flex items-center">
        {right || rightAction || (
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}