"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, MapIcon, StarIcon, ToolboxIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "카탈로그", icon: GridIcon, enabled: true },
  { href: "/starter-kit", label: "AX 스타터 키트", icon: ToolboxIcon, enabled: true },
  { href: "/roadmap", label: "로드맵", icon: MapIcon, enabled: false },
  { href: "/strategy", label: "팀 AX 전략", icon: StarIcon, enabled: false },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[252px] shrink-0 border-r border-[#eceef1] bg-white p-5 pt-7 flex flex-col gap-8">
      <div className="flex items-center gap-2.5 px-2">
        <div className="w-8 h-8 rounded-[9px] shrink-0 bg-[linear-gradient(135deg,#9ccc65_0%,#4fd1c5_55%,#b39ddb_100%)]" />
        <div className="font-extrabold text-[16px] leading-tight tracking-[-0.01em]">
          TEST AX
          <br />
          Portal
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-bold text-[#9aa1ac] uppercase tracking-[0.06em] px-3 mb-1.5">
          메뉴
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.enabled &&
            (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

          if (!item.enabled) {
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-[#9aa1ac] font-semibold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Icon />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] font-bold text-[#b6bcc5] bg-[#f2f3f5] px-1.5 py-0.5 rounded-full">
                  준비중
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                active ? "bg-[#eef1fb] text-[#12213c]" : "text-[#4b5563] hover:bg-[#f7f8fa]"
              }`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-3 rounded-2xl bg-[#f7f8fa] text-xs text-[#8b919c] leading-relaxed">
        팀원이 만들거나 AI로 만든
        <br />
        시스템을 자유롭게 등록해보세요.
      </div>
    </div>
  );
}
