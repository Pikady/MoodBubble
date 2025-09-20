"use client";

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import { Plus, ArrowLeft, FileText } from 'lucide-react';
import NoteBoxList from '@/components/notebox/NoteBoxList'
import { useRouter } from 'next/navigation';

// 模拟数据
const newMockNotes = {
  gratitude: [
    {
      id: '1',
      type: 'gratitude' as const,
      content: '今天和朋友一起吃饭很开心，感谢他们的陪伴！',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      ai_reply: '听起来很美好！友谊就是生活中最珍贵的礼物之一 🌟',
    },
    {
      id: '2',
      type: 'gratitude' as const,
      content: '吃了小蛋糕，单纯的快乐',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      ai_reply: '听起来很美好！友谊就是生活中最珍贵的礼物之一 🌟',
    },
    {
      id: '3',
      type: 'gratitude' as const,
      content: '终于完成了论文，导师评价很好，开心！',
      created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      ai_reply: '听起来很美好！友谊就是生活中最珍贵的礼物之一 🌟',
    },
  ],
  goodnight: [
    {
      id: '4',
      type: 'goodnight' as const,
      content: '晚安！美好的一天！',
      created_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      ai_reply: '晚安！好梦！明天见！',
    },
  ],
  emotion: [
    {
      id: '5',
      type: 'emotion' as const,
      content: '工作压力有点大，感觉需要好好休息一下。',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      ai_reply: '辛苦了！记得劳逸结合，给自己一些放松的时间 💙'
    },
  ],
  reflection: [
    {
      id: '6',
      type: 'reflection' as const,
      content: '今天学到了新东西，感觉每天都在成长。',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      ai_reply: '保持学习的热情是很棒的习惯！继续加油 📚✨'
    }
  ],
};

const testNote = {
  id: 123,
  user_id: 1234,
  type: 'gratitude',
  content: '今天真开心，测试数据',
  ai_reply: '我也很开心，测试数据',
  ai_model: '32b',
  ai_latency_ms: 120,
  tokens_input: 12,
  tokens_output: 321,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
}


function ClipBoxContent() {
  const router = useRouter();

  return (
    <AppShell
      topBar={
        <div className='flex justify-between'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { router.push('/notes/new') }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      }>
      <NoteBoxList noteboxes={newMockNotes}></NoteBoxList>
    </AppShell>
  )
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ClipBoxContent />
    </Suspense>
  );
}