import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { generateSignedUploadParams, isAllowedFileType } from "@/lib/cloudinary";
import { signUploadSchema } from "@/lib/validation";
import { uploadRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit";
import type { JWTPayload } from "@/types";

/**
 * POST /api/admin/media/sign
 *
 * Returns signed Cloudinary upload parameters for secure direct uploads.
 * The client uses these params to upload directly to Cloudinary,
 * so the API secret never leaves the server.
 */
export async function POST(request: Request) {
  const rateLimited = checkRateLimit(uploadRateLimiter, request);
  if (rateLimited) return rateLimited;

  const user = await requireRole("EDITOR");
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const parsed = signUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    // Optional: validate the intended file type from the client
    const mimeType = request.headers.get("x-file-type");
    if (mimeType && !isAllowedFileType(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: "File type not allowed. Accepted: JPEG, PNG, WebP, GIF, AVIF, MP4, WebM",
        },
        { status: 400 }
      );
    }

    const signedParams = generateSignedUploadParams({
      folder: parsed.data.folder,
    });

    await createAuditLog({
      adminId: (user as JWTPayload).sub,
      action: "media.sign",
      meta: { folder: parsed.data.folder },
    });

    return NextResponse.json({ success: true, data: signedParams });
  } catch (error) {
    console.error("[Admin/Media/Sign]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
