import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import NoteBoxCard from '@/components/notebox/NoteBoxCard'
import { ClipboardMinus } from 'lucide-react';
import { Note, NoteType } from '@/lib/types';

const BoxHeightActiveDict = {
  gratitude: {
    gratitude: '100%',
    goodnight: '440px',
    reflection: '380px',
    emotion: '320px',
  },
  goodnight: {
    gratitude: '100%',
    goodnight: 'calc(100% - 90px)',
    reflection: '380px',
    emotion: '320px',
  },
  reflection: {
    gratitude: '100%',
    goodnight: 'calc(100% - 90px)',
    reflection: 'calc(100% - 150px)',
    emotion: '320px',
  },
  emotion: {
    gratitude: '100%',
    goodnight: 'calc(100% - 90px)',
    reflection: 'calc(100% - 150px)',
    emotion: 'calc(100% - 210px)',
  }
};

interface NoteBoxListProps {
  noteboxes: {
    [key in NoteType]: Note[];
  };
}

export default function NoteBoxList({ noteboxes }: NoteBoxListProps) {
  const [activeBox, setActiveBox] = useState<NoteType>('gratitude'); // null 表示没有选中的 box

  const handleClick = (type: NoteType) => {
    setActiveBox(type);
  };

  return (
    <div style={{ background: "url(/images/mascot/bubble_notebox.svg) no-repeat top" }} className="min-h-[400px] overflow-y-hidden	">
      <div className="mx-2 mt-2 relative bg-white/30 backdrop-blur-sm top-[120px]">
        <div className="ml-6 py-2 flex flex-row justify-start items-center">
          <ClipboardMinus className="mr-2 w-5 h-5"></ClipboardMinus>纸条盒</div>
        <NoteBoxCard className="z-1000" notes={noteboxes.gratitude} type="gratitude" onClick={() => handleClick('gratitude')}></NoteBoxCard>
        <NoteBoxCard
          style={{
            height: BoxHeightActiveDict[activeBox].goodnight,
          }}
          className={cn(
            "absolute bottom-0 z-2000 w-[100%]",
          )} notes={noteboxes.goodnight} type="goodnight" onClick={() => handleClick('goodnight')}></NoteBoxCard>
        <NoteBoxCard
          style={{
            height: BoxHeightActiveDict[activeBox].reflection,
          }}
          className={cn(
            "absolute bottom-0 z-3000 w-[100%]",
          )} notes={noteboxes.reflection} type="reflection" onClick={() => handleClick('reflection')}></NoteBoxCard>
        <NoteBoxCard
          style={{
            height: BoxHeightActiveDict[activeBox].emotion,
          }}
          className={cn(
            "absolute bottom-0 z-4000 w-[100%]",
          )} notes={noteboxes.emotion} type="emotion" onClick={() => handleClick('emotion')}></NoteBoxCard>
      </div>
    </div>

  )
}