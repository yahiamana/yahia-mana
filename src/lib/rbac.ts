import { getCurrentUser } from "./auth";
import type { JWTPayload } from "@/types";
import { NextResponse } from "next/server";

/**
 * RBAC (Role-Based Access Control) middleware for API routes.
 * 
 * Usage in an API route:
 *   const user = await requireRole("ADMIN");
 *   if (user instanceof NextResponse) return user; // 401/403 response
 *   // user is now typed as JWTPayload
 */

type RoleLevel = "ADMIN" | "EDITOR";

// Role hierarchy — ADMIN inherits all EDITOR permissions
const ROLE_HIERARCHY: Record<RoleLevel, number> = {
  EDITOR: 1,
  ADMIN: 2,
};

/**
 * Verify the current user has the required role level.
 * Returns the user payload if authorized, or a NextResponse error if not.
 */
export async function requireRole(
  minimumRole: RoleLevel
): Promise<JWTPayload | NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  const userLevel = ROLE_HIERARCHY[user.role] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole];

  if (userLevel < requiredLevel) {
    return NextResponse.json(
      { success: false, error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Higher-order function to wrap an API handler with role checking.
 * Returns early with an error response if the user lacks the required role.
 */
export function withRole(
  minimumRole: RoleLevel,
  handler: (user: JWTPayload, request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    const result = await requireRole(minimumRole);
    if (result instanceof NextResponse) return result;
    return handler(result, request);
  };
}
