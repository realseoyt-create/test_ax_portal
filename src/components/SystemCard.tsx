import Link from "next/link";
import type { SystemSummary } from "@/lib/types";
import { ExternalLinkIcon } from "./icons";
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

export function SystemCard({ system }: { system: SystemSummary }) {
  const gradient = gradientFor(system.id);
  const cover = system.images[0];

  const body = (
    <>
      <div
        className="relative h-[168px] flex items-center justify-center"
        style={{ background: gradient }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={system.name}
            className="relative w-[158px] h-[100px] object-cover rounded-xl shadow-[0_14px_28px_rgba(0,0,0,0.12)] -rotate-2"
          />
        ) : (
          <div className="relative w-[158px] h-[100px] bg-white rounded-xl shadow-[0_14px_28px_rgba(0,0,0,0.12)] -rotate-2 p-2.5">
            <div className="h-2 w-4/5 bg-[#eef0f2] rounded mb-1.5" />
            <div className="h-2 w-3/5 bg-[#eef0f2] rounded mb-1.5" />
            <div className="h-2 w-2/3 bg-[#eef0f2] rounded" />
          </div>
        )}
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
          <ExternalLinkIcon className="shrink-0 mt-0.5 text-[#9aa1ac]" />
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
    </>
  );

  const cardClass =
    "block bg-white rounded-[22px] overflow-hidden shadow-[0_1px_3px_rgba(16,24,40,0.06)] border border-[#eef0f2] transition-transform hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(16,24,40,0.10)]";

  if (system.link) {
    return (
      <a href={system.link} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {body}
      </a>
    );
  }

  return (
    <Link href={`/systems/${system.id}`} className={cardClass}>
      {body}
    </Link>
  );
}
