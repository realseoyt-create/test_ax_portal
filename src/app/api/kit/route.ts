import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readAnonId } from "@/lib/anon";
import { saveUploadedImage } from "@/lib/uploads";
import { isValidAdminCode } from "@/lib/admin";
import type { ResourceSummary } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const tag = searchParams.get("tag")?.trim();
  const anonId = readAnonId(request);

  const items = await prisma.kitItem.findMany({
    where: {
      AND: [
        q ? { name: { contains: q } } : {},
        tag ? { tags: { some: { name: tag } } } : {},
      ],
    },
    include: {
      tags: true,
      images: { orderBy: { order: "asc" } },
      _count: { select: { hearts: true } },
      hearts: anonId ? { where: { anonymousId: anonId }, select: { id: true } } : false,
    },
    orderBy: { createdAt: "desc" },
  });

  const result: ResourceSummary[] = items.map((item) => ({
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

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const adminCode = (formData.get("adminCode") as string | null) ?? "";
  if (!isValidAdminCode(adminCode)) {
    return NextResponse.json({ error: "관리자 코드가 올바르지 않아요." }, { status: 403 });
  }

  const name = (formData.get("name") as string | null)?.trim();
  const shortDescription = (formData.get("shortDescription") as string | null)?.trim();
  const description = ((formData.get("description") as string | null) ?? "").trim();
  const link = ((formData.get("link") as string | null) ?? "").trim();
  const creatorName = (formData.get("creatorName") as string | null)?.trim();
  const tagsRaw = (formData.get("tags") as string | null) ?? "";
  const tagNames = Array.from(new Set(tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)));

  if (!name || !shortDescription || !creatorName) {
    return NextResponse.json({ error: "이름, 한줄 설명, 등록자는 필수예요." }, { status: 400 });
  }
  if (!link) {
    return NextResponse.json({ error: "링크는 필수예요." }, { status: 400 });
  }
  if (tagNames.length === 0) {
    return NextResponse.json({ error: "태그를 하나 이상 입력해주세요." }, { status: 400 });
  }

  const imageFiles = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (imageFiles.length === 0) {
    return NextResponse.json({ error: "대표 이미지를 최소 1장 등록해주세요." }, { status: 400 });
  }

  let savedPaths: string[];
  try {
    savedPaths = await Promise.all(imageFiles.map(saveUploadedImage));
  } catch (err) {
    const message = err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const item = await prisma.kitItem.create({
    data: {
      name,
      shortDescription,
      description,
      link,
      creatorName,
      tags: {
        connectOrCreate: tagNames.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
      images: {
        create: savedPaths.map((imgPath, index) => ({
          path: imgPath,
          isPrimary: index === 0,
          order: index,
        })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json(item, { status: 201 });
}
