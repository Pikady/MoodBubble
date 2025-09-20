"use client";
import React, { useEffect, useRef } from "react";
import { Send } from "lucide-react";

type Props = {
  label: string;               // “晚安纸条”
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
          "absolute -left-[14%] -right-[14%] top-[58%] h-14 rounded-3xl",
          "blur-[1px]",
          accentClass,
        ].join(" ")}
        style={{ transform: "rotate(-10deg)" }}
        aria-hidden
      />

      {/* 前景卡片：更大的圆角 + 柔和阴影；卡片整体倾斜 */}
      <div
        className={[
          "relative rounded-[20px] px-4 pt-3 pb-4",
          "shadow-[0_10px_30px_rgba(25,25,39,0.10)]",
          "border border-white/40 backdrop-blur-[0.5px]",
          bgClass,
        ].join(" ")}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* 左上角类型小标签 */}
        <span className="inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-black/10 text-black/70">
          {label}
        </span>

        {/* 输入区：透明 textarea，placeholder 即提示文案 */}
        <div className="relative mt-2 pr-16">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[120px] max-h-[220px] bg-transparent border-none outline-none
                       resize-none text-[15px] leading-6 text-black/85 placeholder:text-black/55"
            onClick={(e) => e.stopPropagation()} // 避免冒泡影响焦点
          />

          {/* 右下角黑色圆按钮（跟随卡片一起倾斜） */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (canSubmit) onSubmit();
            }}
            disabled={!canSubmit}
            className="absolute -bottom-5 -right-5 h-12 w-12 rounded-full grid place-items-center
                       bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,.25)]
                       disabled:opacity-40 active:scale-95"
            aria-label="发送纸条"
          >
            {actionIcon ?? <Send className="h-5 w-5 translate-y-[1px]" />}
          </button>
        </div>
      </div>
    </div>
  );
}
