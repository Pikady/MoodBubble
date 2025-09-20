import React from 'react';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';

interface AppShellProps {
  // 简单场景 - 直接传递给 TopBar
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showPaperEntry?: boolean;

  // 完全自定义 TopBar
  topBar?: React.ReactNode;

  // 基础属性
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({
  title,
  showBack = false,
  onBack,
  showPaperEntry = false,
  topBar,
  children,
  className
}: AppShellProps) {
  // 默认的 TopBar
  const defaultTopBar = (
    <TopBar
      title={title}
      showBack={showBack}
      onBack={onBack}
      showPaperEntry={showPaperEntry}
    />
  );

  return (
    <div className={cn("flex flex-col min-h-screen bg-background", className)}>
      {/* 顶部导航栏 */}
      {topBar || defaultTopBar}

      {/* 主要内容区域 */}
      <main className="flex-1 overflow-y-auto  overflow-x-visible">
        {children}
      </main>

      {/* 底部安全区域 */}
      <div className="safe-area-bottom" />
    </div>
  );
}