import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaperEntryProps {
  className?: string;
  onClick?: () => void;
  showLogin?: boolean;
  showDemo?: boolean;
}

export default function PaperEntry({ className, onClick, showLogin, showDemo }: PaperEntryProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (showLogin) {
      router.push('/auth/login');
    } else if (showDemo) {
      router.push('/auth/demo');
    } else {
      router.push('/notes/new');
    }
  };

  const buttonText = showDemo ? "演示登录" : showLogin ? "登录" : "泡泡纸条";
  const iconSrc = showDemo ? "/images/mascot/demo-icon.svg" : showLogin ? "/images/mascot/login-icon.svg" : "/images/mascot/edit-icon.svg";
  const iconAlt = showDemo ? "演示" : showLogin ? "登录" : "编辑";

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
        src={iconSrc}
        alt={iconAlt}
        className="w-4 h-4 mr-2"
      />
      {buttonText}
    </Button>
  );
}