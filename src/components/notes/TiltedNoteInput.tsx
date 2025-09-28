"use client";
import React, { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { NoteType } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  label: string;               // “晚安纸条”
  type: NoteType;              // 纸条类型
  placeholder: string;         // 提示文案（点击后在此输入）
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  bgClass?: string;            // 前景卡片底色/渐变，如 "bg-[#CFC6FF]"
  accentClass?: string;        // 背后“溢出色带”颜色，如 "bg-[#BDB2FF]/65"
  tilt?: number;               // 卡片倾斜角度（图里更明显：-6~-8）
  autoFocus?: boolean;
  disabled?: boolean;
  actionIcon?: React.ReactNode;
};

export default function TiltedNoteInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  onSubmit,
  bgClass = "bg-[linear-gradient(180deg,#CFC6FF_0%,#D9D0FF_100%)]",
  accentClass = "bg-[#BDB2FF]/65",
  tilt = -7,
  autoFocus,
  disabled,
  actionIcon,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // 点击整张卡片也能聚焦输入
  const focusInput = () => ref.current?.focus();

  const iconNoteSend = "/images/mascot/note-send-btn.svg"

  /**
   * @param main - 主卡片（带文字卡片）背景色
   * @param sub  - 副卡片（及类型标签）背景色
   */
  const cardColorConfig: Record<NoteType, { main: string, sub: string }> = {
    goodnight: {
      main: "bg-[#B9B6FF]",
      sub: "bg-[#6764B1]"
    },
    gratitude: {
      main: "bg-[#D2ECBF]",
      sub: "bg-[#77856D]",
    },
    emotion: {
      main: "bg-[#B8EFFB]",
      sub: "bg-[#78959B]",
    },
    thought: {
      main: "bg-[#FFF9B6]",
      sub: "bg-[#9E9B7A]",
    },
  };

  // 自动高度（输入时自适应）
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const canSubmit = value.trim().length > 0 && !disabled;

  return (
    <div className="relative overflow-visible" onClick={focusInput}>
      {/* 背后“超宽斜色带”：故意更宽并带角度，制造穿插效果 */}
      <div
        className={[
          "absolute left-[-14%] h-[250px] w-[90%] rounded-3xl rotate-[5deg]",
          "blur-[1px]", cardColorConfig[type]?.sub || accentClass
        ].join(" ")}
        aria-hidden
      />

      {/* 前景卡片：更大的圆角 + 柔和阴影；卡片整体倾斜 */}
      <div
        className={[
          "absolute rounded-[20px] right-[-14%] h-[300px] w-[100%] pt-2 pb-10 px-4 rotate-[-5deg]",
          "shadow-[0_10px_30px_rgba(25,25,39,0.10)]",
          "border border-white/40 backdrop-blur-[0.5px]",
          cardColorConfig[type]?.main || bgClass
        ].join(" ")}
      >
        {/* 左上角类型小标签 */}
        <span className={cn(
          "inline-flex items-center px-4 py-1 text-[11px] rounded-full text-white",
          cardColorConfig[type]?.sub || accentClass
        )}>
          {label}
        </span>

        {/* 输入区：透明 textarea，placeholder 即提示文案 */}
        <div className="relative mt-4 ml-4 pr-16">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[120px] max-h-[220px] bg-transparent border-none outline-none
                       resize-none text-[15px] leading-6 text-black/85 placeholder:text-black/55"
            onClick={(e) => e.stopPropagation()} // 避免冒泡影响焦点
          />
        </div>

        {/* 右下角黑色圆按钮（跟随卡片一起倾斜） */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canSubmit) onSubmit();
          }}
          disabled={!canSubmit}
          className="absolute bottom-10 right-20 h-12 w-12 disabled:opacity-40 active:scale-95"
          aria-label="发送纸条"
        >
          <img src={iconNoteSend} alt="" />
        </button>
      </div>
    </div>
  );
}
