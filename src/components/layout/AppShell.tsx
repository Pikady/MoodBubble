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

  // 桌面端状态栏组件
  const StatusBar = () => (
    <div className="hidden mobile:block mobile:h-6 mobile:bg-gray-100 mobile:border-b mobile:border-gray-200 mobile:px-4 mobile:py-1">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>9:41</span>
        <div className="flex space-x-1">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("flex flex-col min-h-screen bg-background mobile:flex mobile:items-center mobile:justify-center mobile:p-4", className)}>
      {/* 桌面端移动端容器包裹器 */}
      <div className="flex-1 w-full mobile:max-w-md mobile:border-2 mobile:border-gray-200 mobile:rounded-3xl mobile:shadow-xl mobile:overflow-hidden mobile:bg-white mobile:h-[844px] mobile:flex mobile:flex-col mobile:relative">
        {/* 桌面端状态栏 */}
        <StatusBar />

        {/* 顶部导航栏 */}
        {topBar || defaultTopBar}

        {/* 主要内容区域 */}
        <main className="relative flex-1 overflow-y-hidden overflow-x-hidden">
          {children}
        </main>

        {/* 底部安全区域 */}
        <div className="safe-area-bottom" />
      </div>
    </div>
  );
}