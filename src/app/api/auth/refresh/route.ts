import { NextResponse } from "next/server";
import {
  getRefreshTokenFromCookie,
  rotateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
} from "@/lib/auth";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/auth/refresh
 *
 * Rotates the refresh token and issues a new access token.
 * The old refresh token is invalidated (deleted from DB).
 *
 * If the refresh token is invalid (possibly stolen), all cookies are cleared.
 */
export async function POST(request: Request) {
  const rateLimited = checkRateLimit(authRateLimiter, request);
  if (rateLimited) return rateLimited;

  try {
    const oldRefreshToken = await getRefreshTokenFromCookie();

    if (!oldRefreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 }
      );
    }

    const result = await rotateRefreshToken(oldRefreshToken);

    if (!result) {
      // Token not found or expired — possible token theft, clear everything
      await clearAuthCookies();
      return NextResponse.json(
        { success: false, error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Set new cookies
    await setAccessTokenCookie(result.accessToken);
    await setRefreshTokenCookie(result.refreshToken);

    return NextResponse.json({ success: true, message: "Token refreshed" });
  } catch (error) {
    console.error("[Auth/Refresh]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
