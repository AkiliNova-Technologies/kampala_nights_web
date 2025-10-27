export interface Contestant {
  id: string;
  username: string;
  name?: string;
  imageCaption: string;
  votes: number;
  imageUrl?: string;
  status: "active" | "completed" | "draft";
  postImage?: string;
  description?: string;
}

