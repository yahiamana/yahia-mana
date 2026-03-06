import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/admin/messages
 * 
 * Protected admin endpoint to fetch all contact messages.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("[API/Admin/Messages]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
