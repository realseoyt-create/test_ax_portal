"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ResourceSummary } from "@/lib/types";
import { ResourceCard } from "./ResourceCard";
import { SearchIcon, PlusIcon } from "./icons";

export function ResourceGrid({
  title,
  subtitle,
  registerHref,
  registerLabel,
  searchPlaceholder,
  emptyMessage,
  initialItems,
  initialTags,
  listEndpoint,
  detailHrefBase,
  heartEndpointBase,
}: {
  title: string;
  subtitle: string;
  registerHref: string;
  registerLabel: string;
  searchPlaceholder: string;
  emptyMessage: string;
  initialItems: ResourceSummary[];
  initialTags: string[];
  listEndpoint: string;
  detailHrefBase: string;
  heartEndpointBase: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [tags] = useState(initialTags);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (activeTag) params.set("tag", activeTag);

      try {
        const res = await fetch(`${listEndpoint}?${params.toString()}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          setItems(await res.json());
        }
      } catch {
        // request was superseded by a newer one; ignore
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, activeTag, listEndpoint]);

  return (
    <div className="dot-grid px-12 pt-10 pb-16 min-h-full">
      <div className="flex items-end justify-between gap-6 flex-wrap mb-7">
        <div>
          <h1 className="m-0 mb-1.5 text-[28px] font-extrabold tracking-[-0.02em]">{title}</h1>
          <p className="m-0 text-sm text-[#6b7280]">{subtitle}</p>
        </div>

        <Link
          href={registerHref}
          className="flex items-center gap-2 bg-[#12213c] text-white rounded-full px-5 py-3 font-bold text-sm hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(18,33,60,0.25)] transition-all"
        >
          <PlusIcon />
          {registerLabel}
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-full px-4 py-2.5 min-w-[260px] shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
          <SearchIcon className="text-[#9aa1ac]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="border-none outline-none text-sm text-[#12213c] bg-transparent w-full"
          />
        </div>

        {tags.length > 0 && (
          <>
            <div className="w-px h-6 bg-[#e5e7eb]" />
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`text-[13px] font-bold px-3.5 py-2 rounded-full cursor-pointer ${
                  activeTag === null
                    ? "bg-[#12213c] text-white"
                    : "bg-white border border-[#e5e7eb] text-[#4b5563]"
                }`}
              >
                전체
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`text-[13px] font-semibold px-3.5 py-2 rounded-full cursor-pointer ${
                    activeTag === tag
                      ? "bg-[#12213c] text-white"
                      : "bg-white border border-[#e5e7eb] text-[#4b5563]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {items.length === 0 && !loading ? (
        <div className="text-sm text-[#9aa1ac] py-16 text-center">{emptyMessage}</div>
      ) : (
        <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fill,minmax(272px,1fr))]">
          {items.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
              detailHref={`${detailHrefBase}/${item.id}`}
              heartEndpoint={`${heartEndpointBase}/${item.id}/heart`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
