import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAuthEvent } from "@/lib/audit";
import { authenticator } from "otplib";
import QRCode from "qrcode";

/**
 * POST /api/auth/enable-2fa
 *
 * Generates a TOTP secret and QR code for the authenticated user.
 * The secret is stored (but 2FA is NOT enabled until verified).
 * The user must scan the QR code and provide a valid TOTP code
 * via /api/auth/verify-2fa to actually enable 2FA.
 */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Generate a new TOTP secret
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, "Portfolio Admin", secret);

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    // Store the secret (but don't enable 2FA yet — wait for verification)
    await prisma.adminUser.update({
      where: { id: user.sub },
      data: { tfaSecret: secret },
    });

    await logAuthEvent(user.sub, "auth.2fa_enabled", {
      note: "Secret generated, awaiting verification",
    });

    return NextResponse.json({
      success: true,
      data: {
        secret, // Allow manual entry as backup
        qrCode: qrCodeDataUrl,
        message: "Scan the QR code with your authenticator app, then verify with a code.",
      },
    });
  } catch (error) {
    console.error("[Auth/Enable2FA]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
