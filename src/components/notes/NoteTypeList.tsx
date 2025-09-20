import NoteTypeCard from "./NoteTypeCard";
import { NoteType } from "@/lib/types";

export default function NoteTypeList() {
  const items: { type: NoteType; title: string; href: string; ribbonBg: string; tiltDeg: number; offsetY: number }[] = [
    { type: "goodnight",  title: "晚安纸条", href: "/notes/new/goodnight",  ribbonBg: "bg-[#CFC6FF]", tiltDeg: -5, offsetY: 0 },
    { type: "gratitude",  title: "感恩纸条", href: "/notes/new/gratitude",  ribbonBg: "bg-[#D6F1C9]", tiltDeg:  3, offsetY: 4 },
    { type: "emotion",    title: "情绪纸条", href: "/notes/new/emotion",    ribbonBg: "bg-[#C8F0FF]", tiltDeg: -4, offsetY: 6 },
    { type: "thought", title: "思考纸条", href: "/notes/new/thought", ribbonBg: "bg-[#FFF0B3]", tiltDeg:  3, offsetY: 8 },
  ];

  return (
    <div className="mt-4 space-y-3">
      {items.map((it) => (
        <NoteTypeCard
          key={it.type}
          type={it.type}
          title={it.title}
          href={it.href}
          ribbonBg={it.ribbonBg}
          tiltDeg={it.tiltDeg}
          offsetY={it.offsetY}
        />
      ))}
    </div>
  );
}
