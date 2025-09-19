import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({ left, right, children, className }: AppShellProps) {
  return (
    <div className={cn("flex flex-col min-h-screen bg-background", className)}>
      {/* 顶部导航栏 */}
      {(left || right) && (
        <div className="sticky top-0 z-10 bg-white border-b safe-area-top">
          <div className="flex items-center justify-between h-14 px-4">
            {left && <div className="flex items-center">{left}</div>}
            {right && <div className="flex items-center">{right}</div>}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* 底部安全区域 */}
      <div className="safe-area-bottom" />
    </div>
  );
}