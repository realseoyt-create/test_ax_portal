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

  const existing = await prisma.heart.findUnique({
    where: { systemId_anonymousId: { systemId: id, anonymousId: anonId } },
  });

  if (existing) {
    await prisma.heart.delete({ where: { id: existing.id } });
  } else {
    const system = await prisma.system.findUnique({ where: { id }, select: { id: true } });
    if (!system) {
      return NextResponse.json({ error: "존재하지 않는 시스템입니다." }, { status: 404 });
    }
    await prisma.heart.create({ data: { systemId: id, anonymousId: anonId } });
  }

  const heartCount = await prisma.heart.count({ where: { systemId: id } });
  return NextResponse.json({ heartCount, hearted: !existing });
}
