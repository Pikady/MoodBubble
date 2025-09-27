// components/notes/NoteTypeCard.tsx
import * as React from "react";
import Link from "next/link";
import { NOTE_CONFIG } from "@/lib/noteConfig";
import { NoteType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Moon, Smile } from "lucide-react";

interface NoteTypeCardProps {
  type: NoteType;
  index: number;      // 当前卡片序号
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
  index,
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
  const iconEmotion = "/images/mascot/emotion-label-icon.svg";
  const iconThought = "/images/mascot/thought-label-icon.svg";
  const posClassConfig = [
    {
      left: "left-[30px]",
      top: "top-[20px]",
      icon: <Moon></Moon>,
    },
    {
      left: "left-[60px]",
      top: "top-[100px]",
      icon: <Smile></Smile>,
    },
    {
      left: "left-[20px]",
      top: "top-[200px]",
      icon: <img src={iconEmotion} alt="" />,
    },
    {
      left: "left-[100px]",
      top: "top-[290px]",
      icon: <img src={iconThought} alt="" />,
    },
  ];
  const boxRotate = -5;

  const inner = (
    <div
      className={cn(
        "rounded-3xl px-6 py-5 shadow-sm active:shadow h-[100%]",
        "active:scale-[0.99] select-none flex",
        bg
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl leading-none">{posClassConfig[index].icon ?? icon ?? cfg.icon}</span>
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
        "overflow-visible h-[100%]", // 关键：允许溢出！
        disabled && "pointer-events-none opacity-50",
      )}
      style={{
        // 让色条“变宽并向左右溢出”：父容器 paddingX=bleedPx，就往外各扩 bleedPx
        marginRight: `-${bleedPx}px`,
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
        className={cn("block overflow-visible rotate-[-5deg] w-[100%] absolute h-[90px] transition-transform duration-300 ease-in-out hover:translate-x-[-10px] hover:translate-y-[2px]",
          posClassConfig[index].left,
          posClassConfig[index].top,
        )} // 关键：外层 link 也别裁剪
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
