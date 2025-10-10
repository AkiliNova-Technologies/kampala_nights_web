export type ReservationStatus = "attended" | "paid" | "cancelled";
export type ReservationTab = "all" | "attended" | "paid" | "cancelled";

export interface Reservation {
  id: number;
  customer: string;
  image?: string;
  phone: string;
  event: string;
  amount: number;
  dateTime: string;
  status: ReservationStatus;
  [key: string]: unknown;
}
