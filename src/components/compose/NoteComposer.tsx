"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function NoteComposer({
  value, onChange, onSubmit, loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}) {
  const disabled = !value.trim() || !!loading;

  return (
    <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t
                    px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-black/40">{value.length} 字</span>
        <Button
          onClick={onSubmit}
          disabled={disabled}
          className="h-11 px-5 rounded-full enabled:active:scale-[0.98]"
        >
          {loading ? "提交中…" : "发送纸条"}
          <Send className="h-4 w-4 ml-2 translate-y-[1px]" />
        </Button>
      </div>
    </div>
  );
}
