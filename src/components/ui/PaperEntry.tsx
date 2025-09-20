import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaperEntryProps {
  className?: string;
  onClick?: () => void;
}

export default function PaperEntry({ className, onClick }: PaperEntryProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/notes/new');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`
        bg-[#121210] text-white hover:bg-gray-800
        rounded-full px-4 py-2 h-9 text-sm font-medium
        ${className || ''}
      `}
    >
      <img
        src="/images/mascot/edit-icon.svg"
        alt="编辑"
        className="w-4 h-4 mr-2"
      />
      泡泡纸条
    </Button>
  );
}