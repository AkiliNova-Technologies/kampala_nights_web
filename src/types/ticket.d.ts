export type TicketStatus = "open" | "in_progress" | "resolved" | "pending";


export interface Ticket {
  id: string;
  ticketNumber: string;
  user: string;
  subject: string;
  business: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  phone?: string;
  email?: string;
  [key: string]: unknown;
}

