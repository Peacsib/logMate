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
          include: { skills: { orderBy: { createdAt: "desc" } } },
        },
      },
    });

    if (!user || !user.attachments[0]) {
      return NextResponse.json({ success: true, skills: [] });
    }

    return NextResponse.json({
      success: true,
      skills: user.attachments[0].skills,
    });
  } catch (err: any) {
    console.error("Error fetching skills:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { id, name, category = "TECHNICAL", level = "DEVELOPING", notes } = body;

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

    if (id) {
      const updated = await prisma.skill.update({
        where: { id },
        data: {
          name,
          category,
          level,
          notes,
        },
      });
      return NextResponse.json({ success: true, skill: updated });
    }

    const created = await prisma.skill.create({
      data: {
        attachmentId,
        name,
        category,
        level,
        notes,
      },
    });

    return NextResponse.json({ success: true, skill: created });
  } catch (err: any) {
    console.error("Error saving skill:", err);
    return NextResponse.json({ success: false, error: "Failed to save skill" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to delete skill" }, { status: 500 });
  }
}
