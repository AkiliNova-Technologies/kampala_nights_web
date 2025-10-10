export type UserRole = "super-admin" | "admin" | "operations" | "marketing" | "helpdesk";
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastActive: string;
  status: UserStatus;
  image?: string;
  [key: string]: unknown;
}