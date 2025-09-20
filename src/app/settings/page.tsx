"use client";

import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, User, Bell, Share, Home, ChevronLeft } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppShell
      topBar={
        <TopBar
          showLeft={false}  // 隐藏左侧
          title="设置"      // 标题会自动居中
          rightContent={
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
            </Button>
          }
        />
      }
    >
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">账号设置</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <span>个人信息</span>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span>通知设置</span>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">应用设置</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <span>通用设置</span>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-gray-500" />
                  <span>首页设置</span>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}