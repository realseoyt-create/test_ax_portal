import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ANON_COOKIE } from "@/lib/anon";
import { ResourceGrid } from "@/components/ResourceGrid";
import type { ResourceSummary } from "@/lib/types";

export default async function CatalogPage() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get(ANON_COOKIE)?.value;

  const [systems, tags] = await Promise.all([
    prisma.system.findMany({
      include: {
        tags: true,
        images: { orderBy: { order: "asc" } },
        _count: { select: { hearts: true } },
        hearts: anonId ? { where: { anonymousId: anonId }, select: { id: true } } : false,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);

  const initialSystems: ResourceSummary[] = systems.map((s) => ({
    id: s.id,
    name: s.name,
    shortDescription: s.shortDescription,
    link: s.link,
    creatorName: s.creatorName,
    tags: s.tags.map((t) => t.name),
    images: s.images.map((i) => i.path),
    heartCount: s._count.hearts,
    heartedByMe: anonId ? s.hearts.length > 0 : false,
  }));

  return (
    <ResourceGrid
      title="시스템 카탈로그"
      subtitle="테스트기술팀이 AI로 만들거나 직접 만든 시스템들을 모아봤어요."
      registerHref="/register"
      registerLabel="새 시스템 등록"
      searchPlaceholder="시스템 이름으로 검색"
      emptyMessage="조건에 맞는 시스템이 없어요."
      initialItems={initialSystems}
      initialTags={tags.map((t) => t.name)}
      listEndpoint="/api/systems"
      detailHrefBase="/systems"
      heartEndpointBase="/api/systems"
    />
  );
}
