import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readAnonId } from "@/lib/anon";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const anonId = readAnonId(request);

  if (!anonId) {
    return NextResponse.json({ error: "익명 식별자를 확인할 수 없습니다." }, { status: 400 });
  }

  const existing = await prisma.kitHeart.findUnique({
    where: { itemId_anonymousId: { itemId: id, anonymousId: anonId } },
  });

  if (existing) {
    await prisma.kitHeart.delete({ where: { id: existing.id } });
  } else {
    const item = await prisma.kitItem.findUnique({ where: { id }, select: { id: true } });
    if (!item) {
      return NextResponse.json({ error: "존재하지 않는 항목입니다." }, { status: 404 });
    }
    await prisma.kitHeart.create({ data: { itemId: id, anonymousId: anonId } });
  }

  const heartCount = await prisma.kitHeart.count({ where: { itemId: id } });
  return NextResponse.json({ heartCount, hearted: !existing });
}
