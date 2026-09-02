import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ANON_COOKIE } from "@/lib/anon";
import { CatalogGrid } from "@/components/CatalogGrid";
import type { SystemSummary } from "@/lib/types";

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

  const initialSystems: SystemSummary[] = systems.map((s) => ({
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
    <CatalogGrid initialSystems={initialSystems} initialTags={tags.map((t) => t.name)} />
  );
}
