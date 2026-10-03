import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch student's logbook entries & attachment details
export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const email = (session?.user?.email || emailParam || "student@logmate.app").trim().toLowerCase();

    // Find student user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { regNumber: email.toUpperCase() },
        ],
      },
      include: {
        attachments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            induction: true,
            logEntries: {
              orderBy: [{ weekNumber: "desc" }, { createdAt: "desc" }],
              include: { evidences: true },
            },
            skills: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Student user not found" },
        { status: 404 }
      );
    }

    let attachment = user.attachments[0];

    // If no attachment exists yet, create default active attachment for student
    if (!attachment) {
      attachment = await prisma.attachment.create({
        data: {
          userId: user.id,
          companyName: "Industrial Attachment Host",
          position: "Work Related Learning Intern",
          department: "Operations & Development",
          status: "ACTIVE",
          startDate: new Date(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 240),
          workingHours: "08:00 - 17:00, Mon - Fri",
          induction: {
            create: {
              completed: false,
              healthSafetyBriefing: true,
              companyPolicies: true,
              facilityTour: true,
              systemsAccess: true,
            },
          },
        },
        include: {
          induction: true,
          logEntries: {
            orderBy: [{ weekNumber: "desc" }, { createdAt: "desc" }],
            include: { evidences: true },
          },
          skills: true,
        },
      });
    }

    const entries = attachment.logEntries || [];

    // Calculate metrics
    const totalEntries = entries.length;
    const totalHours = entries.reduce((acc, curr) => acc + (curr.hoursWorked || 8), 0);
    const completedWeeks = new Set(entries.map((e) => e.weekNumber)).size;
    const aiAssistedCount = entries.filter((e) => e.aiAssisted).length;

    return NextResponse.json({
      success: true,
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        regNumber: user.regNumber,
        institution: user.institution,
        programme: user.programme,
        phone: user.phone,
      },
      attachment: {
        id: attachment.id,
        companyName: attachment.companyName,
        industry: attachment.industry,
        department: attachment.department,
        position: attachment.position,
        supervisorName: attachment.supervisorName,
        supervisorEmail: attachment.supervisorEmail,
        supervisorPhone: attachment.supervisorPhone,
        supervisorRole: attachment.supervisorRole,
        startDate: attachment.startDate,
        endDate: attachment.endDate,
        workingHours: attachment.workingHours,
        status: attachment.status,
        overallObjectives: attachment.overallObjectives,
        induction: attachment.induction,
      },
      entries,
      stats: {
        totalEntries,
        totalHours,
        completedWeeks,
        aiAssistedCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching student logbook:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logbook entries" },
      { status: 500 }
    );
  }
}

// POST: Create or Update a logbook entry
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      id: entryId,
      attachmentId: reqAttachmentId,
      weekNumber,
      entryType = "WEEKLY",
      title,
      date,
      startDate,
      endDate,
      tasksPerformed,
      skillsGained,
      learningExperiences,
      challengesAndSolutions,
      reflection,
      hoursWorked = 8,
      status = "COMPLETED",
      aiAssisted = false,
      email: explicitEmail,
    } = body;

    const email = (session?.user?.email || explicitEmail || "student@logmate.app").trim().toLowerCase();

    // Find student
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

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    let attachmentId = reqAttachmentId || user.attachments[0]?.id;

    if (!attachmentId) {
      // Create active attachment if not exists
      const newAtt = await prisma.attachment.create({
        data: {
          userId: user.id,
          companyName: "Industrial Attachment Host",
          position: "Work Related Learning Intern",
          department: "Engineering / Operations",
          status: "ACTIVE",
        },
      });
      attachmentId = newAtt.id;
    }

    // Determine week number if not supplied
    let week = Number(weekNumber);
    if (!week || isNaN(week)) {
      const highestEntry = await prisma.logEntry.findFirst({
        where: { attachmentId },
        orderBy: { weekNumber: "desc" },
      });
      week = highestEntry ? highestEntry.weekNumber + 1 : 1;
    }

    if (entryId) {
      // Update existing
      const updated = await prisma.logEntry.update({
        where: { id: entryId },
        data: {
          weekNumber: week,
          entryType,
          title: title || `Week ${week} Learning & Activities`,
          tasksPerformed: tasksPerformed || "",
          skillsGained: skillsGained || null,
          learningExperiences: learningExperiences || null,
          challengesAndSolutions: challengesAndSolutions || null,
          reflection: reflection || null,
          hoursWorked: Number(hoursWorked) || 8,
          status,
          aiAssisted: Boolean(aiAssisted),
          date: date ? new Date(date) : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });

      return NextResponse.json({
        success: true,
        entry: updated,
        message: "Logbook entry updated successfully",
      });
    }

    // Create new entry
    const newEntry = await prisma.logEntry.create({
      data: {
        attachmentId,
        weekNumber: week,
        entryType,
        title: title || `Week ${week} Tasks & Reflections`,
        tasksPerformed: tasksPerformed || "Daily workplace activities executed.",
        skillsGained: skillsGained || null,
        learningExperiences: learningExperiences || null,
        challengesAndSolutions: challengesAndSolutions || null,
        reflection: reflection || null,
        hoursWorked: Number(hoursWorked) || 8,
        status,
        aiAssisted: Boolean(aiAssisted),
        date: date ? new Date(date) : new Date(),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      entry: newEntry,
      message: "Logbook entry created successfully",
    });
  } catch (error: any) {
    console.error("Error creating/updating logbook entry:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save logbook entry" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an entry
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing entry ID" }, { status: 400 });
    }

    await prisma.logEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting logbook entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete logbook entry" },
      { status: 500 }
    );
  }
}
