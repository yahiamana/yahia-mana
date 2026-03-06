import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { createUserSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { validateCsrf } from "@/lib/csrf";
import type { JWTPayload } from "@/types";

/**
 * GET /api/admin/users
 * List all admin users. Requires ADMIN role.
 */
export async function GET() {
  const user = await requireRole("ADMIN");
  if (user instanceof NextResponse) return user;

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        tfaEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("[Admin/Users/GET]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a new admin user. Requires ADMIN role.
 */
export async function POST(request: Request) {
  const csrfError = await validateCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireRole("ADMIN");
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const newUser = await prisma.adminUser.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "user.create",
      target: newUser.id,
      meta: { email: newUser.email, role: newUser.role },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error("[Admin/Users/POST]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
