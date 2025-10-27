export type CaseStatus = "open" | "in_progress" | "resolved" | "pending";

export interface ReportedCase {
  id: string;
  caseNumber: string;
  user: string;
  subject: string;
  business: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  phone?: string;
  email?: string;
  assignedTo?: string;
  type?: string;
  [key: string]: unknown;
}