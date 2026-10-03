import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateClarificationQuestions, synthesizeLogEntry } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { action, studentInput, initialNote, qna } = body;

    // Get active attachment details for user context if available
    let userContext: any = undefined;
    if (session?.user?.email) {
      try {
        const student = await prisma.user.findUnique({
          where: { email: session.user.email.toLowerCase() },
          include: {
            attachments: {
              where: { status: "ACTIVE" },
              take: 1,
            },
          },
        });
        const att = student?.attachments?.[0];
        if (att) {
          userContext = {
            position: att.position || undefined,
            department: att.department || undefined,
            companyName: att.companyName || undefined,
          };
        }
      } catch (err) {
        console.error("Context fetch error:", err);
      }
    }

    if (action === "clarify") {
      if (!studentInput || typeof studentInput !== "string") {
        return NextResponse.json(
          { error: "Student input is required for clarification questions." },
          { status: 400 }
        );
      }

      const questions = await generateClarificationQuestions(studentInput.trim(), userContext);
      return NextResponse.json({
        success: true,
        action: "clarify",
        questions,
      });
    }

    if (action === "synthesize") {
      if (!initialNote || !qna || !Array.isArray(qna)) {
        return NextResponse.json(
          { error: "initialNote and qna array are required for synthesis." },
          { status: 400 }
        );
      }

      const structuredEntry = await synthesizeLogEntry({
        initialNote,
        qna,
        userContext,
      });

      return NextResponse.json({
        success: true,
        action: "synthesize",
        entry: structuredEntry,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: 'clarify' and 'synthesize'." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process AI assistant request" },
      { status: 500 }
    );
  }
}
