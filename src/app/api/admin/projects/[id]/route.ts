import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { updateProjectSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { validateCsrf } from "@/lib/csrf";
import type { JWTPayload } from "@/types";

/**
 * GET /api/admin/projects/[id]
 * Fetch a single project for editing.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireRole("EDITOR");
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        gallery: { select: { id: true, url: true, alt: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("[Admin/Projects/GET_ID]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update a project. Requires EDITOR role.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = await validateCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireRole("EDITOR");
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changing
    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Slug already in use" },
          { status: 409 }
        );
      }
    }

    const { gallery, ...projectData } = parsed.data;

    // Update project and gallery
    const updated = await prisma.$transaction(async (tx: any) => {
      // 1. Update project details
      const proj = await tx.project.update({
        where: { id },
        data: {
          ...projectData,
          metrics: projectData.metrics === null ? undefined : (projectData.metrics as any),
        },
      });

      // 2. Sync gallery if provided
      if (gallery !== undefined) {
        // Simple approach: delete all existing gallery items and recreate
        // In a more complex app, we'd diff them to keep existing records/metadata
        await tx.media.deleteMany({ where: { projectId: id } });
        
        if (gallery.length > 0) {
          await tx.media.createMany({
            data: gallery.map(url => ({
              url,
              publicId: url.split('/').pop()?.split('.')[0] || 'unknown',
              projectId: id,
            }))
          });
        }
      }

      return proj;
    });

    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "project.update",
      target: id,
      meta: { changes: Object.keys(parsed.data) },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin/Projects/PUT]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete a project. Requires ADMIN role.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = await validateCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireRole("ADMIN");
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({ where: { id } });

    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "project.delete",
      target: id,
      meta: { title: existing.title },
    });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("[Admin/Projects/DELETE]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
