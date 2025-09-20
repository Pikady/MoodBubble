import React from 'react';
import { useRouter } from 'next/navigation';
import { Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaperCollectionProps {
  className?: string;
  onClick?: () => void;
}

export default function PaperCollection({ className, onClick }: PaperCollectionProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/notes');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative w-[106px] h-[40px]",
        "bg-[#121210] rounded-[30px]",
        "flex items-center justify-center",
        "hover:bg-gray-800 transition-colors",
        "active:scale-95 transition-transform",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#121210]",
        className
      )}
    >
      {/* Folder 图标 */}
      <Folder
        className="w-[14px] h-[14px] text-white mr-[6px]"
        strokeWidth={2}
      />

      {/* 文字 */}
      <span className="text-white text-[14px] font-normal leading-normal whitespace-nowrap">
        纸条盒
      </span>
    </button>
  );
}