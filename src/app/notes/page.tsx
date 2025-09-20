"use client";

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import { Plus, ArrowLeft, FileText } from 'lucide-react';
import NoteBoxList from '@/components/notebox/NoteBoxList'
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/useNotes';
import { NoteType } from '@/lib/types';

function ClipBoxContent() {
  const router = useRouter();
  const { notes, isLoading } = useNotes();

  // 将笔记按类型分组
  const groupNotesByType = () => {
    const grouped: Record<NoteType, any[]> = {
      goodnight: [],
      gratitude: [],
      emotion: [],
      thought: []
    };

    notes.forEach(note => {
      if (grouped[note.type]) {
        grouped[note.type].push(note);
      }
    });

    return grouped;
  };

  if (isLoading) {
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const groupedNotes = groupNotesByType();

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
        </div>
      }>
      <div className="h-full">
        <NoteBoxList noteboxes={groupedNotes}></NoteBoxList>
      </div>
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