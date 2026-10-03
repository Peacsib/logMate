import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, regNumber, programme, institution, phone, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanReg = regNumber ? String(regNumber).trim().toUpperCase() : null;

    // Check if email already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Check if regNumber already in use if provided
    if (cleanReg) {
      const existingUserReg = await prisma.user.findUnique({
        where: { regNumber: cleanReg },
      });
      if (existingUserReg) {
        return NextResponse.json(
          { error: "An account with this registration number already exists." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        regNumber: cleanReg,
        institution: institution ? String(institution).trim() : "University of Zimbabwe",
        programme: programme ? String(programme).trim() : "BSc Honours in Computer Science",
        phone: phone ? String(phone).trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        regNumber: true,
        institution: true,
        programme: true,
      },
    });

    return NextResponse.json(
      {
        message: "Student account created successfully. You can now sign in.",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
