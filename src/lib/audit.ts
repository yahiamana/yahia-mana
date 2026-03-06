import { prisma } from "./prisma";

/**
 * Create an audit log entry for admin actions.
 * All admin mutations should call this to maintain an audit trail.
 *
 * Action naming convention: "resource.verb"
 * Examples: "project.create", "auth.login", "media.upload", "user.deactivate"
 */
export async function createAuditLog(params: {
  adminId: string;
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        target: params.target || undefined,
        meta: params.meta ? (params.meta as any) : undefined,
      },
    });
  } catch (error) {
    // Audit log failures should not break the main operation
    console.error("[AuditLog] Failed to create entry:", error);
  }
}

/** Convenience: log an auth event */
export async function logAuthEvent(
  adminId: string,
  action: "auth.login" | "auth.logout" | "auth.failed" | "auth.2fa_enabled" | "auth.2fa_verified" | "auth.password_reset",
  meta?: Record<string, unknown>
) {
  return createAuditLog({ adminId, action, meta });
}
