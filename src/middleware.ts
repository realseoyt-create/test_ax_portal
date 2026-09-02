import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ANON_COOKIE } from "@/lib/anon";

const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;

export function middleware(request: NextRequest) {
  if (request.cookies.get(ANON_COOKIE)) {
    return NextResponse.next();
  }

  const anonId = crypto.randomUUID();

  // Also expose it on the current request so this same request's
  // server components / route handlers can see it, not just the next one.
  const requestHeaders = new Headers(request.headers);
  const existingCookieHeader = requestHeaders.get("cookie") ?? "";
  requestHeaders.set(
    "cookie",
    existingCookieHeader
      ? `${existingCookieHeader}; ${ANON_COOKIE}=${anonId}`
      : `${ANON_COOKIE}=${anonId}`
  );

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(ANON_COOKIE, anonId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: FIVE_YEARS,
  });
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
