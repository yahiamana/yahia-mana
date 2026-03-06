import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { createProjectSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { validateCsrf } from "@/lib/csrf";
import type { JWTPayload } from "@/types";

/**
 * GET /api/admin/projects
 * List all projects (including unpublished) for admin management.
 */
export async function GET(request: Request) {
  const user = await requireRole("EDITOR");
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") || "20"));

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          gallery: { select: { id: true, url: true, alt: true } },
        },
      }),
      prisma.project.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[Admin/Projects/GET]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/projects
 * Create a new project. Requires EDITOR role or above.
 */
export async function POST(request: Request) {
  // CSRF check
  const csrfError = await validateCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireRole("EDITOR");
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    const { gallery, ...projectData } = parsed.data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        metrics: projectData.metrics === null ? undefined : (projectData.metrics as any),
        gallery: {
          create: gallery.map(url => ({
            url,
            publicId: url.split('/').pop()?.split('.')[0] || 'unknown', // Basic extraction
          }))
        }
      },
      include: {
        gallery: true
      }
    });

    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "project.create",
      target: project.id,
      meta: { title: project.title, slug: project.slug },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("[Admin/Projects/POST]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
