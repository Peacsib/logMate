# LogMate — Work-Related Learning Logbook Platform

**LogMate** is a personalised digital **Work Related Learning (WRL) logbook platform for students**.

It gives each student one place to manage their entire attachment journey — from **placement details and induction to daily activities, skills, reflections, evidence, learning and final logbook records**.

The core idea is simple:

> **Work. Learn. Log.**

Students can record what they actually did during their attachment without struggling to write formal logbook entries from scratch.

---
## Key Features

### Student Portal (`/student`)

- **Personal Profile** — Degree, programme, student ID, and personal details
- **Placement Management** — Host company, department, role, supervisor, and attachment dates
- **Induction Records** — Capture early orientation activities and company context
- **Digital Logbook / Activity Timeline** — Week-by-week activity log with objectives, tasks, and reflections
- **AI-Assisted Logbook Writing** — Context-aware Gemini AI generates logbook entries from simple natural-language inputs
- **Skills Development Record** — Track technical and professional skills gained throughout the attachment
- **Reflections and Learning** — Personal learning journal and self-assessment entries
- **Evidence / Document Storage** — Upload and attach supporting documents, certificates, photos
- **Attachment History** — Full history of past WRL placements
- **Professional Logbook Preview** — View the logbook exactly as it would appear in a submitted format
- **PDF / Excel Export** — Download and share the complete logbook record

> LogMate is deliberately **student-centred**. It does not attempt to reproduce supervisor, assessor, or coordinator workflows. Students do not need approval from any other party to register or use the platform.

---

## Tech Stack

- **Framework**: Next.js (App Router, Server Components & Server Actions)
- **Database**: PostgreSQL (`logmate`)
- **ORM**: Prisma with relational migrations
- **Authentication**: Custom JWT-based auth (role-based middleware protection)
- **Styling**: Tailwind CSS, CSS variables
- **Icons**: Lucide React
- **AI**: Google Gemini API (context-aware log assistant)
- **Forms & Validation**: Zod, React Hook Form

---

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/logmate"
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="LogMate"
GEMINI_API_KEY="your-gemini-api-key"
```

### 2. Database Migration & Seeding

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed database with demo student data
npx tsx prisma/seed.ts
```

### 3. Development Server

```bash
npm run dev -- -p 3001
```

Navigate to `http://localhost:3001`.

---

## Demo Account

| Role | Email | Password |
|---|---|---|
| **Student** | `student@logmate.app` | `password123` |

---

## License

University of Zimbabwe (UZ) — LogMate WRL Platform.