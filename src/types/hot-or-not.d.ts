// types/hot-or-not.ts
export interface HotOrNotContest {
  id: string;
  category: string;
  description?: string;
  coverImageUrl?: string;
  theme: 'FASHION' | 'NIGHTLIFE';
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  startDate?: string;
  durationHours?: number;
  createdAt: string;
  updatedAt: string;
  contestants: Contestant[];
}

export interface Contestant {
  id: string;
  postId: string;
  post: {
    id: string;
    caption: string;
    authorId: string;
    PostMedia: Array<{
      id: string;
      url: string;
    }>;
    author?: {
      id: string;
      username: string;
      profilePicture?: string;
    };
  };
  voteCount?: number;
}

export interface NominationCandidate {
  id: string;
  caption: string;
  likeCount: number;
  author: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  PostMedia: Array<{
    id: string;
    url: string;
  }>;
  status: 'pending_curation';
}