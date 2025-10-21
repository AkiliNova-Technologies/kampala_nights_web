export type ReservationStatus = "pending" | "attended" | "paid" | "cancelled";
export type ReservationTab = "all" | "pending" | "attended" | "paid" | "cancelled";

export interface Reservation {
  id: number;
  customer: string;
  phone: string;
  email: string;
  event: string;
  amount: number;
  dateTime: string;
  status: ReservationStatus;
  image?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  table?: string;
  guests?: number;
  paymentMethod?: string;
  reservationCreated?: string;
  paymentReceived?: string;
  checkedIn?: string;
  eventAttended?: string;
  eventDescription?: string;
  [key: string]: unknown;
}
