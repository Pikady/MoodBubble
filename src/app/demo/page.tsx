"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Plus, Settings, Share, Search, Menu } from 'lucide-react';

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState(0);

  const demos = [
    {
      title: "标准页面",
      description: "显示返回按钮和标题",
      component: (
        <AppShell
          title="聊天页面"
          showBack
          onBack={() => {}}
        >
          <div className="p-4">
            <Card>
              <CardContent className="p-4">
                <p>这是一个标准的页面布局，左侧有返回按钮，中间有标题。</p>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      )
    },
    {
      title: "居中标题",
      description: "隐藏左侧，标题居中显示",
      component: (
        <AppShell
          topBar={
            <TopBar
              showLeft={false}
              title="设置"
              rightContent={
                <Button variant="ghost" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
              }
            />
          }
        >
          <div className="p-4">
            <Card>
              <CardContent className="p-4">
                <p>左侧隐藏，标题居中，右侧有分享按钮。</p>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      )
    },
    {
      title: "完全自定义",
      description: "完全自定义三个区域的内容",
      component: (
        <AppShell
          topBar={
            <TopBar
              leftContent={
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              }
              centerContent={
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="搜索..."
                    className="px-3 py-1 border rounded-md text-sm"
                  />
                </div>
              }
              rightContent={
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              }
            />
          }
        >
          <div className="p-4">
            <Card>
              <CardContent className="p-4">
                <p>完全自定义的顶部栏，包含菜单、搜索框和设置按钮。</p>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      )
    },
    {
      title: "简约模式",
      description: "只显示标题，无其他元素",
      component: (
        <AppShell
          title="关于我们"
        >
          <div className="p-4">
            <Card>
              <CardContent className="p-4">
                <p>简约模式，只显示标题，左右都没有按钮。</p>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      )
    },
    {
      title: "复杂功能",
      description: "多个按钮和特殊功能",
      component: (
        <AppShell
          topBar={
            <TopBar
              showBack
              onBack={() => {}}
              title="编辑纸条"
              rightContent={
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Share className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              }
            />
          }
        >
          <div className="p-4">
            <Card>
              <CardContent className="p-4">
                <p>复杂功能页面，左侧返回，中间标题，右侧多个按钮。</p>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部选择器 */}
      <div className="sticky top-0 bg-white border-b p-4 z-10">
        <h1 className="text-xl font-bold mb-4">TopBar 使用示例</h1>
        <div className="flex flex-wrap gap-2">
          {demos.map((demo, index) => (
            <Button
              key={index}
              variant={currentDemo === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentDemo(index)}
            >
              {demo.title}
            </Button>
          ))}
        </div>
      </div>

      {/* 当前示例 */}
      <div className="mb-4">
        <Card className="mx-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{demos[currentDemo].title}</h3>
            <p className="text-sm text-gray-600">{demos[currentDemo].description}</p>
          </CardContent>
        </Card>
      </div>

      {/* 示例页面 */}
      <div className="bg-white rounded-t-3xl shadow-lg min-h-[600px]">
        {demos[currentDemo].component}
      </div>
    </div>
  );
}