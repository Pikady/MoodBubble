import React from 'react';
import { Note } from '@/lib/types';

interface NoteBoxContentProps {
  notes: Note[]
}

function formatDateToChinese(dateString: string): string {
  const date = new Date(dateString);

  // 获取年月日
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();

  // 格式化为 xxxx年xx月xx日
  return `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;
}

export default function NoteBoxContent({notes} : NoteBoxContentProps) {

  return (
    <div className="mx-2 mt-2">
      {notes.map((it) => (
        <div className="mb-4" key={it.id}>
          <div className="text-gray-400 mb-1 text-xs">{formatDateToChinese(it.created_at)}</div>
          <div className="text-gray-800 text-md leading-relaxed">{it.content}</div>
        </div>
      ))}
    </div>
  )
}