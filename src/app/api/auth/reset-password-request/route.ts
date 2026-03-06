import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordRequestSchema } from "@/lib/validation";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { SignJWT } from "jose";
import { sendPasswordResetEmail } from "@/lib/mail";

/**
 * POST /api/auth/reset-password-request
 *
 * Initiates a password reset flow by generating a signed JWT token
 * and (in production) sending it via email. For security, always
 * returns success even if the email doesn't exist.
 */
export async function POST(request: Request) {
  const rateLimited = checkRateLimit(authRateLimiter, request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = resetPasswordRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const user = await prisma.adminUser.findUnique({ where: { email } });

    // Always respond with success to prevent email enumeration
    if (user && user.isActive) {
      // Generate a signed reset token (valid for 1 hour)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const resetToken = await new SignJWT({ sub: user.id, purpose: "password-reset" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

      // In production, send this token via email
      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${resetToken}`;
      
      // Send email via nodemailer
      await sendPasswordResetEmail(email, resetUrl);
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[Auth/ResetPasswordRequest]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
