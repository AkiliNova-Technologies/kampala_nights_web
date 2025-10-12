export type TransactionStatus = "paid" | "cancelled";
export type PaymentMethod = "mobile_money" | "bank_transfer" | "card";

export interface Transaction {
  id: string;
  transactionNumber: string;
  event: string;
  customer: string;
  phone: string;
  location: string;
  totalAmount: number;
  commission: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  date: string;
  business?: string;
  invoiceNumber?: string;
  note?: string;
  [key: string]: unknown;
}
