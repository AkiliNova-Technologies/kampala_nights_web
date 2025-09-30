export interface Business {
  id: number;
  business: string;
  owner: string;
  registrationDate: string;
  status: "pending" | "approved" | "cancelled" | "suspended";
  address?: string;
  image?: string;
  [key: string]: unknown;
}