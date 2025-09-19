import React from 'react';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';

interface AppShellProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showPaperEntry?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({
  title,
  left,
  right,
  showBack = false,
  onBack,
  showPaperEntry = false,
  children,
  className
}: AppShellProps) {
  return (
    <div className={cn("flex flex-col min-h-screen bg-background", className)}>
      {/* 顶部导航栏 */}
      <TopBar
        title={title}
        left={left}
        right={right}
        showBack={showBack}
        onBack={onBack}
        showPaperEntry={showPaperEntry}
      />

      {/* 主要内容区域 */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* 底部安全区域 */}
      <div className="safe-area-bottom" />
    </div>
  );
}