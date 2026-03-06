import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  clearAuthCookies,
  getRefreshTokenFromCookie,
  getCurrentUser,
  verifyRefreshToken,
} from "@/lib/auth";
import { logAuthEvent } from "@/lib/audit";

/**
 * POST /api/auth/logout
 *
 * Clears the session by:
 * 1. Deleting the refresh token session from the database
 * 2. Clearing all auth cookies
 */
export async function POST() {
  try {
    const user = await getCurrentUser();
    const rawRefreshToken = await getRefreshTokenFromCookie();

    // Try to delete the session from DB
    if (rawRefreshToken) {
      const sessions = await prisma.session.findMany({
        where: user ? { adminId: user.sub } : {},
      });

      for (const session of sessions) {
        const isMatch = await verifyRefreshToken(rawRefreshToken, session.refreshToken);
        if (isMatch) {
          await prisma.session.delete({ where: { id: session.id } });
          break;
        }
      }
    }

    // Log the logout
    if (user) {
      await logAuthEvent(user.sub, "auth.logout");
    }

    // Clear cookies regardless
    await clearAuthCookies();

    return NextResponse.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("[Auth/Logout]", error);
    // Still clear cookies even if something fails
    await clearAuthCookies();
    return NextResponse.json({ success: true, message: "Logged out" });
  }
}
