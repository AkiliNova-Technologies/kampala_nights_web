export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "upcoming" | "draft";
  startDate?: string;
  endDate?: string;
  category: "FASHION" | "NIGHTLIFE";
  imageUrl?: string;
  contestants?: Array<{
    id: string;
    name: string;
    votes: number;
    rank: number;
  }>;
  totalVotes?: number;
}