"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, Send } from 'lucide-react';

interface TextInputBarProps {
  placeholder: string;
  onFocus?: () => void;
  onSubmit?: (text: string) => void;
  className?: string;
}

export default function TextInputBar({
  placeholder,
  onFocus,
  onSubmit,
  className
}: TextInputBarProps) {
  const [value, setValue] = useState('');

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Button
        variant="outline"
        className="w-full h-11 text-left justify-start text-gray-500"
        onClick={handleFocus}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {value || placeholder}
      </Button>
    </div>
  );
}