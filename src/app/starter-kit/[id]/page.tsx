import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ANON_COOKIE } from "@/lib/anon";
import { ResourceDetailView } from "@/components/ResourceDetailView";
import type { ResourceDetail } from "@/lib/types";

export default async function StarterKitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const anonId = cookieStore.get(ANON_COOKIE)?.value;

  const kitItem = await prisma.kitItem.findUnique({
    where: { id },
    include: {
      tags: true,
      images: { orderBy: { order: "asc" } },
      _count: { select: { hearts: true } },
      hearts: anonId ? { where: { anonymousId: anonId }, select: { id: true } } : false,
    },
  });

  if (!kitItem) notFound();

  const item: ResourceDetail = {
    id: kitItem.id,
    name: kitItem.name,
    shortDescription: kitItem.shortDescription,
    description: kitItem.description,
    link: kitItem.link,
    creatorName: kitItem.creatorName,
    tags: kitItem.tags.map((t) => t.name),
    images: kitItem.images.map((i) => i.path),
    heartCount: kitItem._count.hearts,
    heartedByMe: anonId ? kitItem.hearts.length > 0 : false,
  };

  return (
    <ResourceDetailView
      item={item}
      backHref="/starter-kit"
      backLabel="스타터 키트로 돌아가기"
      heartEndpoint={`/api/kit/${kitItem.id}/heart`}
    />
  );
}
