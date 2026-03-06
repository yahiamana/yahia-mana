import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { apiRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mail";

/**
 * POST /api/contact
 *
 * Public contact form endpoint.
 * Validates input, optionally verifies reCAPTCHA, stores message, and
 * (in production) sends an email notification.
 */
export async function POST(request: Request) {
  const rateLimited = checkRateLimit(apiRateLimiter, request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Store the message in the database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    });

    // Send email notification via nodemailer
    await sendContactNotification({ name, email, subject, message });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent.",
    });
  } catch (error) {
    console.error("[API/Contact]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
