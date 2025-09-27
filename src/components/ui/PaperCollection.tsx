import React from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardMinus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaperCollectionProps {
  className?: string;
  onClick?: () => void;
}

export default function PaperCollection({ className, onClick }: PaperCollectionProps) {
  const router = useRouter();
  const iconNotebox = "/images/mascot/notebox-icon.svg";

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

      <img className="w-[20px] h-[20px] text-white mr-[8px]" src={iconNotebox} alt="" />

      {/* 文字 */}
      <span className="text-white text-[14px] font-normal leading-normal whitespace-nowrap">
        纸条盒
      </span>
    </button>
  );
}