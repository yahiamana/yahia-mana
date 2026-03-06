import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * CSRF Protection using the Double-Submit Cookie pattern.
 *
 * How it works:
 * 1. Server generates a random CSRF token and sets it in a cookie.
 * 2. Client reads the cookie and sends the token in a header (X-CSRF-Token).
 * 3. Server compares the cookie value with the header value.
 *
 * This works because an attacker on a different origin cannot read cookies
 * from the target domain (same-origin policy), so they can't set the header.
 */

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/** Generate a cryptographically random CSRF token */
function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Set a new CSRF token cookie. Call this on login / page load. */
export async function setCsrfCookie(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Client JS needs to read this to send as header
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return token;
}

/**
 * Validate CSRF token on a mutating request (POST, PUT, DELETE, PATCH).
 * Returns a 403 response if validation fails, or null if valid.
 */
export async function validateCsrf(request: Request): Promise<NextResponse | null> {
  // Only validate mutating methods
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null; // Safe methods don't need CSRF protection
  }

  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!headerToken || !cookieToken) {
    return NextResponse.json(
      { success: false, error: "CSRF token missing" },
      { status: 403 }
    );
  }

  // Constant-time comparison to prevent timing attacks
  if (!timingSafeEqual(headerToken, cookieToken)) {
    return NextResponse.json(
      { success: false, error: "CSRF token mismatch" },
      { status: 403 }
    );
  }

  return null; // Valid
}

/** Constant-time string comparison */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
