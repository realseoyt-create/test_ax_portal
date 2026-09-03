import Link from "next/link";
import type { ResourceDetail } from "@/lib/types";
import { ArrowLeftIcon, ExternalLinkIcon } from "./icons";
import { HeartButton } from "./HeartButton";

export function ResourceDetailView({
  item,
  backHref,
  backLabel,
  heartEndpoint,
}: {
  item: ResourceDetail;
  backHref: string;
  backLabel: string;
  heartEndpoint: string;
}) {
  return (
    <div className="dot-grid px-12 pt-10 pb-16 min-h-full">
      <div className="max-w-[720px] mx-auto">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#12213c] mb-6"
        >
          <ArrowLeftIcon />
          {backLabel}
        </Link>

        {item.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-6 pb-1">
            {item.images.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={item.name}
                className="h-[260px] rounded-2xl object-cover shrink-0"
              />
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">{item.name}</h1>
          <div className="flex items-center gap-2 shrink-0">
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#12213c] text-white rounded-full px-3.5 py-2 font-bold text-xs"
              >
                <ExternalLinkIcon />
                링크로 이동
              </a>
            )}
            <HeartButton
              endpoint={heartEndpoint}
              initialCount={item.heartCount}
              initialHearted={item.heartedByMe}
            />
          </div>
        </div>

        <p className="text-sm text-[#9aa1ac] font-semibold mb-4">by {item.creatorName}</p>

        <div className="flex gap-1.5 flex-wrap mb-6">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[#f2f3f5] text-[#4b5563]"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[15px] leading-relaxed whitespace-pre-line text-[#374151]">
          {item.description || item.shortDescription}
        </p>
      </div>
    </div>
  );
}
