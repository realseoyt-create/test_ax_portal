"use client";

import { useState } from "react";
import { HeartIcon } from "./icons";

export function HeartButton({
  endpoint,
  initialCount,
  initialHearted,
  className,
}: {
  endpoint: string;
  initialCount: number;
  initialHearted: boolean;
  className?: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [hearted, setHearted] = useState(initialHearted);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const prevCount = count;
    const prevHearted = hearted;

    setPending(true);
    setHearted(!prevHearted);
    setCount(prevHearted ? prevCount - 1 : prevCount + 1);

    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error("heart toggle failed");
      const data = (await res.json()) as { heartCount: number; hearted: boolean };
      setCount(data.heartCount);
      setHearted(data.hearted);
    } catch {
      setCount(prevCount);
      setHearted(prevHearted);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={hearted}
      className={
        className ??
        "flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1.5 font-bold text-xs text-[#12213c] shadow-[0_4px_10px_rgba(0,0,0,0.10)] cursor-pointer"
      }
    >
      <HeartIcon filled={hearted} />
      {count}
    </button>
  );
}
