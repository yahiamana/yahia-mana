import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Admin Message Management Endpoints
 * 
 * PATCH /api/admin/messages/[id] - Toggle read status
 * DELETE /api/admin/messages/[id] - Delete a message
 */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { read } = await request.json();
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("[API/Admin/Messages/ID]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/Admin/Messages/ID]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
