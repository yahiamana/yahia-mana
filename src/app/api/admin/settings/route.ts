import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { validateCsrf } from "@/lib/csrf";
import { createAuditLog } from "@/lib/audit";
import type { JWTPayload } from "@/types";

/**
 * Site Settings API
 * 
 * GET /api/admin/settings - Fetch current settings
 * PUT /api/admin/settings - Update settings
 */

export async function GET() {
  const user = await requireRole("EDITOR");
  if (user instanceof NextResponse) return user;

  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" }
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[API/Admin/Settings/GET]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireRole("ADMIN");
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    
    // Whitelist allowed fields from body
    const { 
      siteTitle, siteTagline, heroHeading, heroSubheading, 
      heroCta, heroCtaLink, aboutText, contactEmail,
      socialGithub, socialLinkedin, socialTwitter
    } = body;

    const settings = await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        siteTitle, siteTagline, heroHeading, heroSubheading,
        heroCta, heroCtaLink, aboutText, contactEmail,
        socialGithub, socialLinkedin, socialTwitter
      }
    });

    // Log the change
    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "settings.update",
      meta: { updatedFields: Object.keys(body) }
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[API/Admin/Settings/PUT]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
