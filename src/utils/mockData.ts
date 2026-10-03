export interface Student {
  id: string;
  regNumber: string;
  name: string;
  programme: string;
  email: string;
  phone: string;
  placementId?: string;
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  company: string;
  companyId: string;
  phone: string;
  jobTitle: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface Placement {
  created_at?: string;
  id: string;
  studentId: string;
  student_id?: string;
  supervisorId: string;
  supervisor_id?: string;
  companyId: string;
  company_id?: string;
  lecturerId: string;
  lecturer_id?: string;
  startDate: string;
  start_date?: string;
  endDate: string;
  end_date?: string;
  status: any;
}

export interface Submission {
  id: string;
  studentId: string;
  student_id?: string;
  title: string;
  type: string;
  dueDate?: string;
  due_date?: string;
  submittedDate?: string;
  submitted_date?: string;
  status: any;
  fileUrl?: string;
  file_url?: string;
}

// Assessment interface removed - feature not implemented in database schema

export interface Message {
  id: string;
  senderId: string;
  sender_id?: string;
  receiverId: string;
  receiver_id?: string;
  content: string;
  timestamp: string;
  created_at?: string;
  read: boolean;
}

export interface PlacementSubmission {
  company_city?: string;
  company_name?: string;
  supervisor_name?: string;
  start_date?: string;
  student_id?: string;
  reg_number?: string;
  company_address?: string;
  supervisor_phone?: string;
  supervisor_email?: string;
  student_email?: string;
  student_phone?: string;
  assigned_lecturer_id?: string;
  submitted_at?: string;
  id: string;
  studentId: string;
  regNumber: string;
  surname: string;
  forenames: string;
  programme: string;
  companyName: string;
  companyAddress: string;
  city: string;
  suburb: string;
  supervisorName: string;
  supervisorPhone: string;
  supervisorEmail: string;
  studentEmail: string;
  studentPhone: string;
  startDate: string;
  status: "pending_coordinator" | "pending_supervisor" | "active" | "rejected";
  assignedLecturerId?: string;
  submittedAt: string;
}

export interface LogbookEntry {
  id: string;
  studentId: string;
  student_id?: string;
  week: number;
  week_number?: number;
  weekEndingDate?: string;
  week_ending_date?: string;
  objectives: string;
  actualTasks?: string;
  actual_tasks?: string;
  reflection: string;
  status: any;
  supervisorApproved?: boolean;
  supervisor_approved?: boolean;
  submittedAt?: string;
  submitted_at?: string;
  dueDate?: string;
  due_date?: string;
}

// All dummy data arrays emptied in favor of PostgreSQL database sync
export const companies: Company[] = [];
export const supervisors: Supervisor[] = [];
export const lecturers: Lecturer[] = [];
export const students: Student[] = [];
export const placements: Placement[] = [];
export const submissions: Submission[] = [];
export const messages: Message[] = [];
export const placementSubmissions: PlacementSubmission[] = [];
export const logbookEntries: LogbookEntry[] = [];
export const departments: string[] = [];

export type UserRole = "student" | "supervisor" | "lecturer" | "coordinator";

export interface AuthUser {
  reg_number?: string;
  regNumber?: string;
  department?: string;
  faculty?: string;
  programme?: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const mockUsers: Record<string, AuthUser & { password: string }> = {};
