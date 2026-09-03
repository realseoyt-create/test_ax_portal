// Interim admin gate for AX 스타터 키트 registration, used until SSO ships.
// A shared code (env var) stands in for "is this an admin" today. When SSO is
// introduced, replace the body of this function with a real role check
// (e.g. looking up the authenticated user's role) — every caller already
// treats this as an opaque yes/no check, so no call site needs to change.
export function isValidAdminCode(code: string | null | undefined): boolean {
  const expected = process.env.ADMIN_CODE;
  if (!expected) return false;
  return !!code && code === expected;
}
