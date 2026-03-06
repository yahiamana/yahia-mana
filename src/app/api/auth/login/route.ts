import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSession,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  recordFailedLogin,
  resetFailedLogins,
  isAccountLocked,
} from "@/lib/auth";
import { setCsrfCookie } from "@/lib/csrf";
import { loginSchema } from "@/lib/validation";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/audit";
import { authenticator } from "otplib";

/**
 * POST /api/auth/login
 *
 * Authenticates an admin user with email + password.
 * If 2FA is enabled, also requires a TOTP code.
 * Sets HttpOnly cookies for access and refresh tokens.
 */
export async function POST(request: Request) {
  // Rate limit check
  const rateLimited = checkRateLimit(authRateLimiter, request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, totpCode } = parsed.data;

    // Look up user
    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      // Don't reveal whether the email exists
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check account lockout
    if (isAccountLocked(user.lockedUntil)) {
      return NextResponse.json(
        {
          success: false,
          error: "Account is temporarily locked. Please try again later.",
        },
        { status: 423 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      await recordFailedLogin(email);
      await logAuthEvent(user.id, "auth.failed", {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        reason: "invalid_password",
      });
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check 2FA if enabled
    if (user.tfaEnabled) {
      if (!totpCode) {
        return NextResponse.json(
          { success: false, error: "2FA code required", requires2FA: true },
          { status: 401 }
        );
      }

      if (!user.tfaSecret) {
        return NextResponse.json(
          { success: false, error: "2FA configuration error" },
          { status: 500 }
        );
      }

      const isValidTotp = authenticator.check(totpCode, user.tfaSecret);
      if (!isValidTotp) {
        await recordFailedLogin(email);
        await logAuthEvent(user.id, "auth.failed", {
          reason: "invalid_2fa",
        });
        return NextResponse.json(
          { success: false, error: "Invalid 2FA code" },
          { status: 401 }
        );
      }
    }

    // Success! Create session and set cookies
    await resetFailedLogins(user.id);

    const userAgent = request.headers.get("user-agent") || undefined;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || undefined;

    const { accessToken, refreshToken } = await createSession(user.id, userAgent, ip);

    await setAccessTokenCookie(accessToken);
    await setRefreshTokenCookie(refreshToken);
    const csrfToken = await setCsrfCookie();

    await logAuthEvent(user.id, "auth.login", { ip });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        csrfToken,
      },
    });
  } catch (error) {
    console.error("[Auth/Login]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
