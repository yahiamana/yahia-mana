import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/audit";
import { jwtVerify } from "jose";

/**
 * POST /api/auth/reset-password
 *
 * Completes the password reset by verifying the signed token
 * and updating the user's password hash.
 */
export async function POST(request: Request) {
  const rateLimited = checkRateLimit(authRateLimiter, request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    // Verify the reset token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload;
    try {
      const result = await jwtVerify(token, secret);
      payload = result.payload as { sub: string; purpose: string };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Validate token purpose
    if (payload.purpose !== "password-reset") {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    // Update the password
    const newHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: payload.sub },
      data: {
        passwordHash: newHash,
        failedLogins: 0,
        lockedUntil: null, // Unlock the account
      },
    });

    // Invalidate all existing sessions for this user
    await prisma.session.deleteMany({
      where: { adminId: payload.sub },
    });

    await logAuthEvent(payload.sub, "auth.password_reset");

    return NextResponse.json({
      success: true,
      message: "Password has been reset. Please log in with your new password.",
    });
  } catch (error) {
    console.error("[Auth/ResetPassword]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
