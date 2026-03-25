// middleware.ts  ← place this in the ROOT of your project (same level as app/)
// Protects /owner/* and /tenant/* routes based on the "role" cookie.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("role")?.value; // "owner" | "tenant" | undefined

  // ── If not logged in, redirect to /login ──────────────────────────────────
  if (!role) {
    if (pathname.startsWith("/owner") || pathname.startsWith("/tenant")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ── Owner trying to access tenant routes → redirect to owner dashboard ────
  if (role === "owner" && pathname.startsWith("/tenant")) {
    return NextResponse.redirect(new URL("/owner/dashboard", req.url));
  }

  // ── Tenant trying to access owner routes → redirect to tenant dashboard ───
  if (role === "tenant" && pathname.startsWith("/owner")) {
    return NextResponse.redirect(new URL("/tenant/dashboard", req.url));
  }

  // ── Logged-in user visiting /login or / → send to their dashboard ─────────
  if (pathname === "/login" || pathname === "/") {
    const dest = role === "owner" ? "/owner/dashboard" : "/tenant/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to these paths
export const config = {
  matcher: ["/", "/login", "/owner/:path*", "/tenant/:path*"],
};