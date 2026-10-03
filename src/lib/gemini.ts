import { GoogleGenAI } from "@google/genai";

export interface ClarificationQuestion {
  id: string;
  question: string;
  category: "scope" | "problem" | "solution" | "tools" | "challenges" | "learnings" | "skills";
  placeholder?: string;
}

export interface StructuredLogOutput {
  title: string;
  tasksPerformed: string;
  skillsGained: string;
  learningExperiences: string;
  challengesAndSolutions: string;
  reflection: string;
  hoursWorked: number;
}

const DEFAULT_QUESTIONS: ClarificationQuestion[] = [
  {
    id: "scope",
    category: "scope",
    question: "What specific component, module, or section were you working on?",
    placeholder: "e.g. The customer authentication form and API validation endpoints",
  },
  {
    id: "problem",
    category: "problem",
    question: "What problem, ticket, or business requirement were you trying to solve?",
    placeholder: "e.g. Users with special characters in their emails were failing login validation",
  },
  {
    id: "solution",
    category: "solution",
    question: "What concrete steps did you take to implement or solve it?",
    placeholder: "e.g. Refactored regex validation and added automated Jest tests",
  },
  {
    id: "tools",
    category: "tools",
    question: "Which tools, libraries, or technologies did you use during this task?",
    placeholder: "e.g. Next.js, TypeScript, Zod, Git, and Postman",
  },
  {
    id: "challenges",
    category: "challenges",
    question: "Did you encounter any technical hurdles, bugs, or blockers, and how did you resolve them?",
    placeholder: "e.g. Experienced state hydration mismatch; resolved with suppressHydrationWarning",
  },
  {
    id: "learnings",
    category: "learnings",
    question: "What new insights did you gain, or what skills did you develop/strengthen?",
    placeholder: "e.g. Deepened understanding of server-side data validation and edge cases",
  },
];

function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

/**
 * STEP 1: Ask -> Clarify
 * Analyze the student's brief input and return relevant follow-up questions.
 * The AI MUST NOT invent work the student did not perform.
 */
export async function generateClarificationQuestions(
  studentInput: string,
  userContext?: { position?: string; department?: string; companyName?: string }
): Promise<ClarificationQuestion[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
    // Intelligent contextual fallback
    return generateLocalQuestions(studentInput);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are the AI Mentor for "LogMate — Work. Learn. Log.", a digital Work Related Learning logbook for students.
A student just wrote a brief summary of their work today:
"${studentInput}"

${userContext?.position ? `Student Role: ${userContext.position}` : ""}
${userContext?.companyName ? `Company: ${userContext.companyName}` : ""}

YOUR ROLE IS SOCRATIC: Ask -> Clarify -> Structure -> Improve.
Do NOT invent work the student did not perform.
Generate 5 to 6 targeted, thoughtful follow-up questions to help the student clarify what they actually did, how they did it, what tools they used, challenges faced, and what they learned.

Return a valid JSON array of objects with the following schema ONLY:
[
  {
    "id": "string",
    "category": "scope" | "problem" | "solution" | "tools" | "challenges" | "learnings" | "skills",
    "question": "string (the clear question)",
    "placeholder": "string (an example answer to inspire the student)"
  }
]
`;

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return generateLocalQuestions(studentInput);
  } catch (err) {
    console.error("Gemini clarification error, using local fallback:", err);
    return generateLocalQuestions(studentInput);
  }
}

/**
 * STEP 2: Structure -> Improve
 * Transform the student's real answers into a structured, accredited logbook entry.
 * Strictly adheres to: Source of truth = student's actual answers. No hallucinations.
 */
export async function synthesizeLogEntry(params: {
  initialNote: string;
  qna: Array<{ question: string; answer: string; category?: string }>;
  userContext?: { position?: string; department?: string; companyName?: string };
}): Promise<StructuredLogOutput> {
  const apiKey = getApiKey();
  const { initialNote, qna, userContext } = params;

  // Filter answered questions
  const answered = qna.filter((item) => item.answer && item.answer.trim().length > 0);

  if (!apiKey || answered.length === 0) {
    return synthesizeLocalEntry(initialNote, answered);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const formattedAnswers = answered
      .map((item, idx) => `Q${idx + 1}: ${item.question}\nA: ${item.answer}`)
      .join("\n\n");

    const prompt = `
You are the expert academic advisor for "LogMate — Work. Learn. Log.", a personalised digital Work Related Learning logbook.
The student provided this initial summary:
"${initialNote}"

Follow-up Questions & the Student's Authentic Answers:
${formattedAnswers}

${userContext?.position ? `Student Role: ${userContext.position}` : ""}
${userContext?.companyName ? `Company: ${userContext.companyName}` : ""}

CRITICAL INTEGRITY INSTRUCTION:
- You must NOT invent work, tasks, or metrics that the student did not perform or state.
- The student's answers remain the sole source of truth.
- Your role is to:
  1. Clean up informal language into professional, accredited engineering/workplace logbook phrasing.
  2. Structure the information into standard Work Related Learning sections.
  3. Formulate deep reflections connecting their practical actions to professional and academic competencies.

Return a valid JSON object matching this schema ONLY:
{
  "title": "string (Concise, professional title for this logbook entry)",
  "tasksPerformed": "string (Bullet points using • of actual tasks executed, action verbs, clear and technically precise)",
  "skillsGained": "string (Comma-separated list of technical tools, frameworks, and professional competencies demonstrated)",
  "learningExperiences": "string (Clear paragraph explaining the key technical or workplace learnings acquired)",
  "challengesAndSolutions": "string (Specific technical or organizational challenges faced and the exact steps taken to resolve them)",
  "reflection": "string (Thoughtful reflective evaluation connecting practical workplace execution to academic theory and personal growth)",
  "hoursWorked": 8
}
`;

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || "Daily Workplace Activity",
        tasksPerformed: parsed.tasksPerformed || initialNote,
        skillsGained: parsed.skillsGained || "Problem Solving, Technical Execution",
        learningExperiences: parsed.learningExperiences || "Acquired hands-on experience in practical implementation.",
        challengesAndSolutions: parsed.challengesAndSolutions || "Addressed and resolved operational requirements.",
        reflection: parsed.reflection || "A productive work session applying academic skills to workplace tasks.",
        hoursWorked: Number(parsed.hoursWorked) || 8,
      };
    }

    return synthesizeLocalEntry(initialNote, answered);
  } catch (err) {
    console.error("Gemini synthesis error, using local fallback:", err);
    return synthesizeLocalEntry(initialNote, answered);
  }
}

/**
 * Contextual fallback generator when offline or no API key is set
 */
function generateLocalQuestions(studentInput: string): ClarificationQuestion[] {
  const lower = studentInput.toLowerCase();

  const questions = [...DEFAULT_QUESTIONS];

  if (lower.includes("website") || lower.includes("frontend") || lower.includes("page") || lower.includes("ui")) {
    questions[0] = {
      id: "scope",
      category: "scope",
      question: "Which specific pages, components, or user flows were you designing or coding?",
      placeholder: "e.g. The dashboard landing cards, responsive navbar, and user settings modal",
    };
    questions[3] = {
      id: "tools",
      category: "tools",
      question: "Which frontend frameworks, CSS libraries, or browser tools did you use?",
      placeholder: "e.g. Next.js, React, Tailwind CSS, Chrome DevTools",
    };
  } else if (lower.includes("database") || lower.includes("sql") || lower.includes("query") || lower.includes("backend")) {
    questions[0] = {
      id: "scope",
      category: "scope",
      question: "Which database tables, relations, or backend API endpoints were you working on?",
      placeholder: "e.g. PostgreSQL users and transactions tables, Prisma schema migrations",
    };
    questions[3] = {
      id: "tools",
      category: "tools",
      question: "Which backend languages, ORMs, or database management clients did you use?",
      placeholder: "e.g. Node.js, Prisma ORM, PostgreSQL, pgAdmin, Postman",
    };
  } else if (lower.includes("bug") || lower.includes("fix") || lower.includes("error") || lower.includes("issue")) {
    questions[1] = {
      id: "problem",
      category: "problem",
      question: "What was the root cause of the error or bug you diagnosed?",
      placeholder: "e.g. Unhandled null value in API response causing client runtime crash",
    };
  }

  return questions;
}

function synthesizeLocalEntry(
  initialNote: string,
  answered: Array<{ question: string; answer: string; category?: string }>
): StructuredLogOutput {
  const getAnswer = (category: string) => {
    const item = answered.find((a) => a.category === category || a.question.toLowerCase().includes(category));
    return item ? item.answer.trim() : "";
  };

  const scope = getAnswer("scope") || initialNote;
  const problem = getAnswer("problem");
  const solution = getAnswer("solution");
  const tools = getAnswer("tools");
  const challenges = getAnswer("challenges");
  const learnings = getAnswer("learnings");

  // Derive professional title
  let title = "Industrial Task Execution & Development";
  if (scope.length > 0) {
    const cleanScope = scope.replace(/^(i was working on|worked on|working on)\s+/i, "");
    title = cleanScope.charAt(0).toUpperCase() + cleanScope.slice(1);
    if (title.length > 55) title = title.slice(0, 52) + "...";
  }

  // Derive structured tasks performed
  const tasks: string[] = [];
  if (scope) tasks.push(`Assigned to work on ${scope.replace(/[.]+$/, "")}.`);
  if (problem) tasks.push(`Investigated and analyzed requirement: ${problem.replace(/[.]+$/, "")}.`);
  if (solution) tasks.push(`Implemented technical solution: ${solution.replace(/[.]+$/, "")}.`);
  if (tools) tasks.push(`Leveraged industry tooling and environment: ${tools.replace(/[.]+$/, "")}.`);

  const tasksText = tasks.map((t) => `• ${t}`).join("\n");

  return {
    title,
    tasksPerformed: tasksText || `• ${initialNote}`,
    skillsGained: tools ? `${tools}, Systematic Problem Solving, Industry Standards` : "Practical Technical Execution, Work Ethic, Problem Solving",
    learningExperiences: learnings || `Deepened understanding of real-world implementation while addressing ${scope}.`,
    challengesAndSolutions: challenges || (problem && solution ? `Challenge: ${problem}\nResolution: ${solution}` : "Diagnosed system constraints and applied established engineering protocols."),
    reflection: `This activity bridged academic theoretical concepts with direct industrial application. Solving real workplace requirements reinforced my technical adaptability and professional confidence.`,
    hoursWorked: 8,
  };
}
