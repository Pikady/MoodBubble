import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label?: string;
}

export default function IconButton({
  icon,
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-11 w-11", className)}
      {...props}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </Button>
  );
}