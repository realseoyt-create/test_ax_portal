import type { NextRequest } from "next/server";

export const ANON_COOKIE = "ax_anon_id";

export function readAnonId(request: NextRequest): string | undefined {
  return request.cookies.get(ANON_COOKIE)?.value;
}
