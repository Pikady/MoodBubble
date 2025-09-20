// components/notes/NoteTypeCard.tsx
import * as React from "react";
import Link from "next/link";
import { NOTE_CONFIG } from "@/lib/noteConfig";
import { NoteType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NoteTypeCardProps {
  type: NoteType;
  title?: string;
  href?: string;
  onClick?: () => void;
  className?: string;

  ribbonBg?: string;   // 覆盖 NOTE_CONFIG.cardBg
  tiltDeg?: number;    // 外层旋转角（内层会反向）
  offsetY?: number;    // 微小上下错位
  icon?: React.ReactNode;
  disabled?: boolean;
  "aria-label"?: string;

  /**
   * 与父容器 paddingX 对齐，用来计算“向左右溢出”的负外边距。
   * 比如父容器是 px-4（=16px），这里就传 16。
   */
  bleedPx?: number;
}

export default function NoteTypeCard({
  type,
  title,
  href,
  onClick,
  className,
  ribbonBg,
  tiltDeg,
  offsetY = 0,
  icon,
  disabled,
  bleedPx = 16, // 父容器一般用 px-4 => 16px
  ...a11y
}: NoteTypeCardProps) {
  const cfg = NOTE_CONFIG[type];
  const displayTitle = title ?? cfg.label;
  const bg = ribbonBg ?? cfg.cardBg;
  const angle = typeof tiltDeg === "number" ? tiltDeg : (cfg.tiltDeg ?? -4);

  const inner = (
    <div
      className={cn(
        "ribbon-inner rounded-3xl px-6 py-5 shadow-sm active:shadow",
        "transition-transform active:scale-[0.99] select-none",
        bg
      )}
      style={{ transform: `rotate(${-angle}deg)` }}
    >
      <div className="flex items-center gap-4">
          <span className="text-2xl leading-none">{icon ?? cfg.icon}</span>
        <div className="flex-1">
          <div className={cn("text-base font-semibold tracking-wide", cfg.color)}>
            {displayTitle}
          </div>
        </div>
      </div>
    </div>
  );

  const body = (
    <div
      data-type={type}
      aria-disabled={disabled || undefined}
      className={cn(
        "ribbon-outer block overflow-visible", // 关键：允许溢出！
        disabled && "pointer-events-none opacity-50",
        className
      )}
      style={{
        // 让色条“变宽并向左右溢出”：父容器 paddingX=bleedPx，就往外各扩 bleedPx
        width: `calc(100% + ${bleedPx * 2}px)`,
        marginLeft: `-${bleedPx}px`,
        marginRight: `-${bleedPx}px`,
        transform: `translateY(${offsetY}px) rotate(${angle}deg)`,
        transformOrigin: "center",
      }}
      onClick={onClick}
    >
      {inner}
    </div>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        aria-label={a11y["aria-label"] ?? `选择${displayTitle}`}
        onClick={onClick}
        className="block overflow-visible" // 关键：外层 link 也别裁剪
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={a11y["aria-label"] ?? `选择${displayTitle}`}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="block overflow-visible" // 关键：允许溢出
    >
      {body}
    </div>
  );
}
