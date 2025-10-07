export type InvoiceStatus = "paid" | "cancelled";
export type InvoiceTab = "all" | "paid" | "cancelled";

export interface Invoice {
  id: number;
  customer: string;
  image?: string;
  invoiceNumber: string;
  event: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod: string;
  [key: string]: unknown;
}