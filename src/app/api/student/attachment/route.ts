import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");

    const email = (session?.user?.email || emailParam || "student@logmate.app").trim().toLowerCase();

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
            skills: true,
            evidences: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    let attachment = user.attachments[0];
    if (!attachment) {
      attachment = await prisma.attachment.create({
        data: {
          userId: user.id,
          companyName: "Econet Wireless Zimbabwe",
          department: "Digital Innovation & Cloud Systems",
          position: "Software Engineering Trainee",
          industry: "Telecommunications & Digital Services",
          supervisorName: "Eng. Farai Mandaza",
          supervisorEmail: "farai.mandaza@econet.co.zw",
          supervisorPhone: "+263 77 123 4567",
          supervisorRole: "Principal Systems Architect",
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-05-31"),
          status: "ACTIVE",
          induction: {
            create: {
              completed: true,
              completionDate: new Date("2026-09-02"),
              healthSafetyBriefing: true,
              companyPolicies: true,
              facilityTour: true,
              systemsAccess: true,
              toolsProvided: "MacBook Pro M2, Dual Displays, AWS sandbox, GitHub Enterprise",
            },
          },
        },
        include: {
          induction: true,
          skills: true,
          evidences: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      attachment,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        regNumber: user.regNumber,
        institution: user.institution,
        programme: user.programme,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    console.error("Error fetching attachment:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch attachment records" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const {
      companyName,
      industry,
      department,
      position,
      address,
      city,
      supervisorName,
      supervisorEmail,
      supervisorPhone,
      supervisorRole,
      startDate,
      endDate,
      workingHours,
      overallObjectives,
      // Induction fields
      induction,
    } = body;

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
          include: { induction: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    let attachment = user.attachments[0];

    if (!attachment) {
      attachment = await prisma.attachment.create({
        data: {
          userId: user.id,
          companyName: companyName || "Host Company",
          industry,
          department,
          position,
          address,
          city,
          supervisorName,
          supervisorEmail,
          supervisorPhone,
          supervisorRole,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          workingHours,
          overallObjectives,
        },
        include: { induction: true },
      });
    } else {
      attachment = await prisma.attachment.update({
        where: { id: attachment.id },
        data: {
          companyName: companyName || attachment.companyName,
          industry: industry !== undefined ? industry : attachment.industry,
          department: department !== undefined ? department : attachment.department,
          position: position !== undefined ? position : attachment.position,
          address: address !== undefined ? address : attachment.address,
          city: city !== undefined ? city : attachment.city,
          supervisorName: supervisorName !== undefined ? supervisorName : attachment.supervisorName,
          supervisorEmail: supervisorEmail !== undefined ? supervisorEmail : attachment.supervisorEmail,
          supervisorPhone: supervisorPhone !== undefined ? supervisorPhone : attachment.supervisorPhone,
          supervisorRole: supervisorRole !== undefined ? supervisorRole : attachment.supervisorRole,
          startDate: startDate ? new Date(startDate) : attachment.startDate,
          endDate: endDate ? new Date(endDate) : attachment.endDate,
          workingHours: workingHours !== undefined ? workingHours : attachment.workingHours,
          overallObjectives: overallObjectives !== undefined ? overallObjectives : attachment.overallObjectives,
        },
        include: { induction: true },
      });
    }

    // Update induction record if supplied
    if (induction) {
      if (attachment.induction) {
        await prisma.induction.update({
          where: { id: attachment.induction.id },
          data: {
            completed: induction.completed !== undefined ? Boolean(induction.completed) : attachment.induction.completed,
            completionDate: induction.completionDate ? new Date(induction.completionDate) : attachment.induction.completionDate,
            conductedBy: induction.conductedBy !== undefined ? induction.conductedBy : attachment.induction.conductedBy,
            healthSafetyBriefing: induction.healthSafetyBriefing !== undefined ? Boolean(induction.healthSafetyBriefing) : attachment.induction.healthSafetyBriefing,
            healthSafetyNotes: induction.healthSafetyNotes !== undefined ? induction.healthSafetyNotes : attachment.induction.healthSafetyNotes,
            companyPolicies: induction.companyPolicies !== undefined ? Boolean(induction.companyPolicies) : attachment.induction.companyPolicies,
            companyPoliciesNotes: induction.companyPoliciesNotes !== undefined ? induction.companyPoliciesNotes : attachment.induction.companyPoliciesNotes,
            facilityTour: induction.facilityTour !== undefined ? Boolean(induction.facilityTour) : attachment.induction.facilityTour,
            systemsAccess: induction.systemsAccess !== undefined ? Boolean(induction.systemsAccess) : attachment.induction.systemsAccess,
            toolsProvided: induction.toolsProvided !== undefined ? induction.toolsProvided : attachment.induction.toolsProvided,
            supervisorExpectations: induction.supervisorExpectations !== undefined ? induction.supervisorExpectations : attachment.induction.supervisorExpectations,
            generalNotes: induction.generalNotes !== undefined ? induction.generalNotes : attachment.induction.generalNotes,
          },
        });
      } else {
        await prisma.induction.create({
          data: {
            attachmentId: attachment.id,
            completed: Boolean(induction.completed),
            completionDate: induction.completionDate ? new Date(induction.completionDate) : new Date(),
            conductedBy: induction.conductedBy || null,
            healthSafetyBriefing: Boolean(induction.healthSafetyBriefing),
            healthSafetyNotes: induction.healthSafetyNotes || null,
            companyPolicies: Boolean(induction.companyPolicies),
            companyPoliciesNotes: induction.companyPoliciesNotes || null,
            facilityTour: Boolean(induction.facilityTour),
            systemsAccess: Boolean(induction.systemsAccess),
            toolsProvided: induction.toolsProvided || null,
            supervisorExpectations: induction.supervisorExpectations || null,
            generalNotes: induction.generalNotes || null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Attachment & induction records saved successfully",
    });
  } catch (err: any) {
    console.error("Error saving attachment:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update records" },
      { status: 500 }
    );
  }
}
