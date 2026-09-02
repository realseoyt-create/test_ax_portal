import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ANON_COOKIE } from "@/lib/anon";
import { ArrowLeftIcon } from "@/components/icons";
import { HeartButton } from "@/components/HeartButton";

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const anonId = cookieStore.get(ANON_COOKIE)?.value;

  const system = await prisma.system.findUnique({
    where: { id },
    include: {
      tags: true,
      images: { orderBy: { order: "asc" } },
      _count: { select: { hearts: true } },
      hearts: anonId ? { where: { anonymousId: anonId }, select: { id: true } } : false,
    },
  });

  if (!system) notFound();

  return (
    <div className="dot-grid px-12 pt-10 pb-16 min-h-full">
      <div className="max-w-[720px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#12213c] mb-6"
        >
          <ArrowLeftIcon />
          카탈로그로 돌아가기
        </Link>

        {system.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-6 pb-1">
            {system.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.path}
                alt={system.name}
                className="h-[260px] rounded-2xl object-cover shrink-0"
              />
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">{system.name}</h1>
          <HeartButton
            systemId={system.id}
            initialCount={system._count.hearts}
            initialHearted={anonId ? system.hearts.length > 0 : false}
          />
        </div>

        <p className="text-sm text-[#9aa1ac] font-semibold mb-4">by {system.creatorName}</p>

        <div className="flex gap-1.5 flex-wrap mb-6">
          {system.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[#f2f3f5] text-[#4b5563]"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <p className="text-[15px] leading-relaxed whitespace-pre-line text-[#374151]">
          {system.description || system.shortDescription}
        </p>
      </div>
    </div>
  );
}
