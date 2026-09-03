"use client";

import { useRouter } from "next/navigation";
import type { SystemSummary } from "@/lib/types";
import { ExternalLinkIcon, ImagesIcon } from "./icons";
import { HeartButton } from "./HeartButton";

const GRADIENTS = [
  "linear-gradient(135deg, #eaf7c9 0%, #9ccc65 100%)",
  "linear-gradient(135deg, #ffe6c2 0%, #ff9f68 100%)",
  "linear-gradient(135deg, #ece0fb 0%, #b39ddb 100%)",
  "linear-gradient(135deg, #cdf5ec 0%, #4fd1c5 100%)",
];

function gradientFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

// Back-to-front layer styles for a fanned photo stack. Index 0 is furthest back.
const LAYER_STYLES = [
  "rotate-6 translate-x-2 translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.10)]",
  "-rotate-3 -translate-x-0.5 translate-y-0.5 shadow-[0_12px_24px_rgba(0,0,0,0.11)]",
  "-rotate-2 shadow-[0_14px_28px_rgba(0,0,0,0.12)]",
];

function ImageStack({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) {
    return (
      <div className="relative w-[158px] h-[100px] bg-white rounded-xl shadow-[0_14px_28px_rgba(0,0,0,0.12)] -rotate-2 p-2.5">
        <div className="h-2 w-4/5 bg-[#eef0f2] rounded mb-1.5" />
        <div className="h-2 w-3/5 bg-[#eef0f2] rounded mb-1.5" />
        <div className="h-2 w-2/3 bg-[#eef0f2] rounded" />
      </div>
    );
  }

  const layers = images.slice(0, 3);
  const styles = LAYER_STYLES.slice(LAYER_STYLES.length - layers.length);

  return (
    <div className="relative w-[158px] h-[100px]">
      {layers.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover rounded-xl bg-white ${styles[i]}`}
        />
      ))}
      {images.length > 1 && (
        <span className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-[#12213c] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
          <ImagesIcon />
          {images.length}
        </span>
      )}
    </div>
  );
}

export function SystemCard({ system }: { system: SystemSummary }) {
  const router = useRouter();
  const gradient = gradientFor(system.id);

  return (
    <div
      onClick={() => router.push(`/systems/${system.id}`)}
      className="bg-white rounded-[22px] overflow-hidden shadow-[0_1px_3px_rgba(16,24,40,0.06)] border border-[#eef0f2] transition-transform hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(16,24,40,0.10)] cursor-pointer"
    >
      <div
        className="relative h-[168px] flex items-center justify-center"
        style={{ background: gradient }}
      >
        <ImageStack images={system.images} alt={system.name} />
        <HeartButton
          systemId={system.id}
          initialCount={system.heartCount}
          initialHearted={system.heartedByMe}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1.5 font-bold text-xs text-[#12213c] shadow-[0_4px_10px_rgba(0,0,0,0.10)] cursor-pointer"
        />
      </div>
      <div className="p-4 pt-4 pb-[18px]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-0 text-[15.5px] font-extrabold tracking-[-0.01em]">{system.name}</h3>
          {system.link && (
            <a
              href={system.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${system.name} 링크 새 탭으로 열기`}
              title="링크로 이동"
              className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[#9aa1ac] hover:bg-[#f2f3f5] hover:text-[#12213c]"
            >
              <ExternalLinkIcon />
            </a>
          )}
        </div>
        <p className="mt-1.5 mb-3 text-[13px] text-[#6b7280] leading-relaxed">
          {system.shortDescription}
        </p>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {system.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#f2f3f5] text-[#4b5563]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-[#9aa1ac] font-semibold">by {system.creatorName}</div>
      </div>
    </div>
  );
}
