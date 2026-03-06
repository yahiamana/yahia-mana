import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { updateUserSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { validateCsrf } from "@/lib/csrf";
import type { JWTPayload } from "@/types";

/**
 * PUT /api/admin/users/[id]
 * Update a user's role or active status. Requires ADMIN role.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = await validateCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireRole("ADMIN");
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 }
      );
    }

    // Prevent admins from deactivating themselves
    if (parsed.data.isActive === false && id === (user as JWTPayload).sub) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "user.update",
      target: id,
      meta: { changes: parsed.data },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin/Users/PUT]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
