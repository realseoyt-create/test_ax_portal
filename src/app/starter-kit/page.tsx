import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ANON_COOKIE } from "@/lib/anon";
import { ResourceGrid } from "@/components/ResourceGrid";
import type { ResourceSummary } from "@/lib/types";

export default async function StarterKitPage() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get(ANON_COOKIE)?.value;

  const [items, tags] = await Promise.all([
    prisma.kitItem.findMany({
      include: {
        tags: true,
        images: { orderBy: { order: "asc" } },
        _count: { select: { hearts: true } },
        hearts: anonId ? { where: { anonymousId: anonId }, select: { id: true } } : false,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.kitTag.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);

  const initialItems: ResourceSummary[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    shortDescription: item.shortDescription,
    link: item.link,
    creatorName: item.creatorName,
    tags: item.tags.map((t) => t.name),
    images: item.images.map((i) => i.path),
    heartCount: item._count.hearts,
    heartedByMe: anonId ? item.hearts.length > 0 : false,
  }));

  return (
    <ResourceGrid
      title="AX 스타터 키트"
      subtitle="OPENCODE, Python 원큐 셋업, 클로드 코드 등 핵심 툴 설치와 Data Lake 접근 링크를 모아뒀어요."
      registerHref="/starter-kit/register"
      registerLabel="새 항목 등록"
      searchPlaceholder="이름으로 검색"
      emptyMessage="조건에 맞는 항목이 없어요."
      initialItems={initialItems}
      initialTags={tags.map((t) => t.name)}
      listEndpoint="/api/kit"
      detailHrefBase="/starter-kit"
      heartEndpointBase="/api/kit"
    />
  );
}
