"use client";

import { useState } from 'react';
import { NoteType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface NoteComposerProps {
  type: NoteType;
  onSubmit: (text: string) => Promise<void> | void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export default function NoteComposer({
  type,
  onSubmit,
  placeholder = "写点什么吧...",
  maxLength = 1000,
  className
}: NoteComposerProps) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const disabled = value.trim().length === 0 || isLoading;

  const handleSubmit = async () => {
    if (disabled) return;

    setIsLoading(true);
    try {
      await onSubmit(value.trim());
      setValue('');
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit();
      }
    }
  };

  return (
    <div className={cn("sticky bottom-0 bg-white border-t", className)}>
      <div className="safe-area-bottom">
        <div className="flex flex-col gap-2 p-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className="flex-1 min-h-[80px] max-h-32 resize-none rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxLength}
            </span>
            <Button
              onClick={handleSubmit}
              disabled={disabled}
              className="h-11 px-4 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2">发送</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}