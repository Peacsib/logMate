import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

function safeParse(date: string): Date {
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return new Date();
    return parsed;
  } catch {
    return new Date();
  }
}

export const formatDate = (date: string) => format(safeParse(date), "dd MMM yyyy");
export const formatDateTime = (date: string) => format(safeParse(date), "dd MMM yyyy, HH:mm");
export const formatRelative = (date: string) => formatDistanceToNow(safeParse(date), { addSuffix: true });

export const getStatusColor = (status: string) => {
  switch (status) {
    case "draft": return "bg-muted text-muted-foreground";
    case "submitted": return "bg-primary/10 text-primary border-primary/20";
    case "reviewed": return "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50";
    case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60";
    case "active": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60";
    case "pending": case "pending_coordinator": case "pending_supervisor": return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700";
    case "completed": return "bg-muted text-muted-foreground border-border";
    case "rejected": return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50";
    default: return "bg-muted text-muted-foreground border-border";
  }
};
