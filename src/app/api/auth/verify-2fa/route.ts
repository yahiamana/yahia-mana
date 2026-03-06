import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { verify2faSchema } from "@/lib/validation";
import { logAuthEvent } from "@/lib/audit";
import { authenticator } from "otplib";

/**
 * POST /api/auth/verify-2fa
 *
 * Verifies a TOTP code from the user's authenticator app.
 * If valid, enables 2FA on the account.
 * This should be called after /api/auth/enable-2fa.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = verify2faSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Retrieve the stored secret
    const dbUser = await prisma.adminUser.findUnique({
      where: { id: user.sub },
      select: { tfaSecret: true },
    });

    if (!dbUser?.tfaSecret) {
      return NextResponse.json(
        { success: false, error: "2FA setup not initiated. Call /api/auth/enable-2fa first." },
        { status: 400 }
      );
    }

    // Verify the TOTP code
    const isValid = authenticator.check(parsed.data.code, dbUser.tfaSecret);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid TOTP code. Please try again." },
        { status: 400 }
      );
    }

    // Enable 2FA on the account
    await prisma.adminUser.update({
      where: { id: user.sub },
      data: { tfaEnabled: true },
    });

    await logAuthEvent(user.sub, "auth.2fa_verified", {
      note: "2FA successfully enabled",
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication has been enabled.",
    });
  } catch (error) {
    console.error("[Auth/Verify2FA]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
