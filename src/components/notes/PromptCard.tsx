import React from "react";

type Props = {
  label: string;            // “晚安纸条”
  message: string;          // 提示文案
  bgClass?: string;         // 主卡片底色（或渐变）
  accentClass?: string;     // 溢出色带（背后横条）
  tilt?: number;            // 倾斜角度
};

export default function PromptCard({
  label, message,
  bgClass = "bg-[linear-gradient(180deg,#CFC6FF_0%,#D9D0FF_100%)]",
  accentClass = "bg-[#BDB2FF]/70",
  tilt = -3,
}: Props) {
  return (
    <div className="relative">
      {/* 背后溢出色带：更宽一些制造穿插感 */}
      <div
        className={[
          "absolute inset-x-[-12%] top-[52%] h-10 rounded-2xl blur-[1px]",
          accentClass,
        ].join(" ")}
        aria-hidden
      />

      {/* 前景卡片：轻倾斜 + 柔和阴影 */}
      <div
        className={[
          "relative rounded-2xl p-4",
          "shadow-[0_6px_24px_rgba(25,25,39,0.08)]",
          bgClass,
        ].join(" ")}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-full bg-black/10 text-black/70">
          {label}
        </span>
        <p className="mt-2 text-[15px] leading-relaxed text-black/85">{message}</p>
      </div>
    </div>
  );
}
