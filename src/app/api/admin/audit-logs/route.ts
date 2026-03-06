import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

/**
 * GET /api/admin/audit-logs
 *
 * View audit logs. Requires ADMIN role.
 * Supports pagination.
 */
export async function GET(request: Request) {
  const user = await requireRole("ADMIN");
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "50"));
    const action = searchParams.get("action");

    const where = action ? { action: { contains: action } } : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          admin: { select: { email: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs.map((log) => ({
        ...log,
        adminEmail: log.admin.email,
      })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("[Admin/AuditLogs]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
