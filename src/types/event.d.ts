export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; 
  time: string;
  location: string;
  attendees: string; 
  price: "Free" | "Paid";
  status: "Pending" | "Approved" | "Rejected";
  category: string;
  imageUrl?: string;
}