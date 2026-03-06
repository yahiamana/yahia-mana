import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware — runs on every request before the route handler.
 * 
 * Handles:
 * 1. Admin auth check (redirect to login if no access_token cookie)
 * 2. Skip auth check for login page and public routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    !pathname.startsWith("/admin")
  ) {
    return NextResponse.next();
  }

  // Admin routes: check for access_token cookie
  const accessToken = request.cookies.get("access_token");
  if (!accessToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Pass the pathname as a header so layouts can read it
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
