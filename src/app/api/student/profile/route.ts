import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const email = (session?.user?.email || emailParam || "student@logmate.app").trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { regNumber: email.toUpperCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        regNumber: user.regNumber,
        institution: user.institution,
        programme: user.programme,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load student profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { name, phone, institution, programme } = body;

    const email = (session?.user?.email || "student@logmate.app").trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { regNumber: email.toUpperCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        phone: phone !== undefined ? phone : user.phone,
        institution: institution !== undefined ? institution : user.institution,
        programme: programme !== undefined ? programme : user.programme,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
