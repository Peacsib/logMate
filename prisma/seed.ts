import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// Initialize Prisma client instance for database seeding
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding LogMate database with initial student and attachment data...")

  const passwordHash = await bcrypt.hash("password123", 10)

  // 1. Create or update Demo Student
  const student = await prisma.user.upsert({
    where: { email: "student@logmate.app" },
    update: {
      name: "Tinashe Mugwagwa",
      regNumber: "R214892M",
      institution: "University of Zimbabwe",
      programme: "BSc (Hons) in Computer Science",
      phone: "+263 77 234 5678",
      passwordHash,
    },
    create: {
      email: "student@logmate.app",
      name: "Tinashe Mugwagwa",
      regNumber: "R214892M",
      institution: "University of Zimbabwe",
      programme: "BSc (Hons) in Computer Science",
      phone: "+263 77 234 5678",
      passwordHash,
    },
  })

  // Also create student@uz.ac.zw alias for convenience
  await prisma.user.upsert({
    where: { email: "student@uz.ac.zw" },
    update: {
      name: "Tinashe Mugwagwa",
      regNumber: "R214892A",
      institution: "University of Zimbabwe",
      programme: "BSc (Hons) in Computer Science",
      phone: "+263 77 234 5678",
      passwordHash,
    },
    create: {
      email: "student@uz.ac.zw",
      name: "Tinashe Mugwagwa",
      regNumber: "R214892A",
      institution: "University of Zimbabwe",
      programme: "BSc (Hons) in Computer Science",
      phone: "+263 77 234 5678",
      passwordHash,
    },
  })

  // 2. Clear old demo attachments for this user to keep seed idempotent
  const existingAttachments = await prisma.attachment.findMany({
    where: { userId: student.id },
  })

  for (const att of existingAttachments) {
    await prisma.attachment.delete({ where: { id: att.id } })
  }

  // 3. Create Attachment
  const attachment = await prisma.attachment.create({
    data: {
      userId: student.id,
      companyName: "Econet Wireless Zimbabwe",
      industry: "Telecommunications & Digital Services",
      department: "Digital Innovation & Cloud Systems",
      position: "Software Engineering Trainee",
      address: "2 Old Mutare Road, Msasa",
      city: "Harare",
      supervisorName: "Eng. Farai Mandaza",
      supervisorEmail: "farai.mandaza@econet.co.zw",
      supervisorPhone: "+263 77 123 4567",
      supervisorRole: "Principal Systems Architect",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-05-31"),
      workingHours: "08:00 - 17:00, Monday to Friday",
      status: "ACTIVE",
      overallObjectives:
        "Gain real-world industry experience in cloud-native application development, API design, database optimisation, CI/CD pipelines, and agile software development workflows.",
    },
  })

  // 4. Create Induction
  await prisma.induction.create({
    data: {
      attachmentId: attachment.id,
      completed: true,
      completionDate: new Date("2026-09-02"),
      conductedBy: "Mrs. S. Chigumba (Senior People & Culture Partner)",
      healthSafetyBriefing: true,
      healthSafetyNotes: "Reviewed emergency evacuation exits, ergonomic best practices, fire safety protocols, and health clinic access.",
      companyPolicies: true,
      companyPoliciesNotes: "Signed Non-Disclosure Agreement (NDA), Data Protection & GDPR/Cybersecurity policies, and code of professional conduct.",
      facilityTour: true,
      systemsAccess: true,
      toolsProvided: "Company workstation, 27-inch secondary monitor, GitHub Enterprise access, Slack, AWS sandbox development account.",
      supervisorExpectations: "Punctuality for 08:30 daily standups, clean documentation of all merged pull requests, weekly learning log maintenance.",
      generalNotes: "Successfully introduced to the Core Engineering team. Assigned to Squad Alpha focusing on customer self-service portals.",
    },
  })

  // 5. Create Log Entries (Weeks 1 to 4)
  const logEntriesData = [
    {
      weekNumber: 1,
      entryType: "WEEKLY",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-05"),
      title: "Workplace Induction, Environment Setup & Codebase Familiarisation",
      tasksPerformed:
        "• Attended corporate orientation and completed all required cybersecurity and compliance training.\n• Set up local development environment (Node.js, Docker, PostgreSQL, VS Code tooling).\n• Cloned and built the core customer portal repository; resolved initial dependency and environment variable discrepancies.\n• Participated in sprint planning and backlog refinement sessions with the squad.",
      skillsGained: "Git / GitHub Enterprise, Docker containerisation, Linux environment configuration, Agile sprint workflows",
      learningExperiences:
        "Learned how enterprise codebases maintain separation of concerns through modular architecture and microservices.",
      challengesAndSolutions:
        "Encountered Docker port conflicts when spinning up the local PostgreSQL replica. Resolved by configuring dynamic port mappings in docker-compose.override.yml.",
      reflection:
        "The shift from academic coursework to a large-scale production codebase was initially overwhelming, but diving into documentation and pairing with a senior engineer gave me confidence.",
      hoursWorked: 40,
      status: "COMPLETED",
      aiAssisted: true,
    },
    {
      weekNumber: 2,
      entryType: "WEEKLY",
      startDate: new Date("2026-09-08"),
      endDate: new Date("2026-09-12"),
      title: "RESTful API Integration & Bug Resolution in User Profile Module",
      tasksPerformed:
        "• Investigated and resolved ticket ENG-412 regarding phone number validation failures on customer profile update.\n• Implemented international E.164 phone formatting using regex and backend validation routines in Node.js.\n• Authored Jest unit tests achieving 92% code coverage on the modified validator modules.\n• Submitted my first pull request, addressed peer review comments, and merged into staging branch.",
      skillsGained: "Jest Unit Testing, Regex Data Validation, Node.js API endpoints, Git branch management & PR workflows",
      learningExperiences:
        "Understood the criticality of comprehensive automated testing before code reaches production environments.",
      challengesAndSolutions:
        "Edge cases for local phone numbers with leading zeroes failed verification. Solved by normalising strings before applying regional area code filters.",
      reflection:
        "Seeing my pull request approved and deployed to the staging environment was highly satisfying and demonstrated the value of unit testing.",
      hoursWorked: 40,
      status: "COMPLETED",
      aiAssisted: false,
    },
    {
      weekNumber: 3,
      entryType: "WEEKLY",
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-19"),
      title: "Database Query Optimisation & Indexing for Customer Transactions",
      tasksPerformed:
        "• Profiled slow query logs on the staging database using PostgreSQL EXPLAIN ANALYZE.\n• Identified missing composite indexes on transaction_history table (user_id, created_at).\n• Created and executed a Prisma migration to add the required indexes.\n• Measured query execution times: average response time dropped from 420ms to 38ms under 100 concurrent requests.",
      skillsGained: "PostgreSQL performance tuning, EXPLAIN ANALYZE, Database indexing strategies, Prisma migrations",
      learningExperiences:
        "Discovered how sequential table scans severely degrade database performance as data volume increases, and how B-tree indexing mitigates this.",
      challengesAndSolutions:
        "Adding indexes on large tables can cause write locks. Learned how PostgreSQL 'CREATE INDEX CONCURRENTLY' prevents downtime in production environments.",
      reflection:
        "Direct application of database concepts learned during Year 2 Database Systems theory into real enterprise operations.",
      hoursWorked: 40,
      status: "COMPLETED",
      aiAssisted: true,
    },
    {
      weekNumber: 4,
      entryType: "WEEKLY",
      startDate: new Date("2026-09-22"),
      endDate: new Date("2026-09-26"),
      title: "UI Component Refactoring & Accessibility Enhancements in Next.js",
      tasksPerformed:
        "• Refactored reusable modal dialogs and dropdown menus using Radix UI primitives and Tailwind CSS.\n• Enhanced keyboard navigation and screen reader ARIA labels across navigation components.\n• Implemented dark mode theme persistence using local storage and CSS variables.\n• Conducted responsive mobile audit on multiple screen dimensions using browser developer tools.",
      skillsGained: "Next.js App Router, Tailwind CSS, Radix UI Primitives, Web Accessibility (WCAG 2.1 AA), Framer Motion",
      learningExperiences:
        "Learned that building accessible user interfaces is not just a nice-to-have, but an essential engineering discipline for inclusivity.",
      challengesAndSolutions:
        "Theme toggling caused a brief flash of unstyled content (FOUC). Solved using NextThemes script hydration suppression.",
      reflection:
        "Deepened my understanding of modern client-side rendering versus server-side rendering in React 19.",
      hoursWorked: 40,
      status: "COMPLETED",
      aiAssisted: true,
    },
  ]

  for (const entry of logEntriesData) {
    await prisma.logEntry.create({
      data: {
        attachmentId: attachment.id,
        ...entry,
      },
    })
  }

  // 6. Seed Skills Matrix
  const skillsData = [
    { name: "TypeScript & JavaScript", category: "TECHNICAL", level: "COMPETENT", notes: "Core language for daily frontend and backend services." },
    { name: "React 19 & Next.js", category: "TECHNICAL", level: "COMPETENT", notes: "Building responsive server and client components." },
    { name: "PostgreSQL & Prisma", category: "TECHNICAL", level: "DEVELOPING", notes: "Schema design, migrations, query optimisation." },
    { name: "Docker & Containerisation", category: "TOOL", level: "DEVELOPING", notes: "Spinning up local development databases and microservices." },
    { name: "Git & GitHub Collaboration", category: "TOOL", level: "PROFICIENT", notes: "Feature branches, PR reviews, merge conflict resolution." },
    { name: "Agile & Scrum Practices", category: "METHODOLOGY", level: "COMPETENT", notes: "Active participant in daily standups and sprint retrospectives." },
    { name: "Technical Communication", category: "SOFT_SKILL", level: "COMPETENT", notes: "Clear documentation of tasks, bug tickets, and logbooks." },
  ]

  for (const sk of skillsData) {
    await prisma.skill.create({
      data: {
        attachmentId: attachment.id,
        ...sk,
      },
    })
  }

  // 7. Seed Evidences
  await prisma.evidence.create({
    data: {
      attachmentId: attachment.id,
      title: "Workstation & Security Onboarding Checklist",
      description: "Signed confirmation of IT security induction and equipment hand-over protocol.",
      fileUrl: "/evidence/onboarding-checklist.pdf",
      fileType: "pdf",
      fileName: "onboarding_signed_checklist.pdf",
      fileSize: 245000,
    },
  })

  await prisma.evidence.create({
    data: {
      attachmentId: attachment.id,
      title: "Transaction Service Architectural Diagram",
      description: "System design flow diagram created during Week 3 database refactoring sprint.",
      fileUrl: "/evidence/architecture-diagram.png",
      fileType: "image",
      fileName: "architecture_diagram.png",
      fileSize: 480000,
    },
  })

  console.log("Seeding complete! LogMate demo student is ready:")
  console.log("Email: student@logmate.app or student@uz.ac.zw")
  console.log("Password: password123")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
