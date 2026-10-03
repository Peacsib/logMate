import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const email = (session?.user?.email || "student@logmate.app").trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { regNumber: email.toUpperCase() },
        ],
      },
      include: {
        attachments: {
          where: { status: "ACTIVE" },
          take: 1,
          include: {
            evidences: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (!user || !user.attachments[0]) {
      return NextResponse.json({ success: true, evidences: [] });
    }

    return NextResponse.json({
      success: true,
      evidences: user.attachments[0].evidences,
    });
  } catch (err: any) {
    console.error("Error fetching evidence:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch evidence" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { title, description, fileUrl, fileType = "document", fileName, fileSize, logEntryId } = body;

    const email = (session?.user?.email || "student@logmate.app").trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { regNumber: email.toUpperCase() },
        ],
      },
      include: {
        attachments: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!user || !user.attachments[0]) {
      return NextResponse.json({ success: false, error: "Active attachment not found" }, { status: 404 });
    }

    const attachmentId = user.attachments[0].id;

    const evidence = await prisma.evidence.create({
      data: {
        attachmentId,
        title,
        description: description || null,
        fileUrl: fileUrl || "/evidence/sample-document.pdf",
        fileType: fileType || "document",
        fileName: fileName || `${title.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        fileSize: Number(fileSize) || 250000,
        logEntryId: logEntryId || null,
      },
    });

    return NextResponse.json({ success: true, evidence });
  } catch (err: any) {
    console.error("Error creating evidence:", err);
    return NextResponse.json({ success: false, error: "Failed to create evidence" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.evidence.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to delete evidence" }, { status: 500 });
  }
}
