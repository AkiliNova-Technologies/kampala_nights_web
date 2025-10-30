export interface Profile {
  id: string;
  // Basic Information
  name: string;
  username: string;
  email?: string;
  phone?: string;

  // Professional Information
  genre: string;
  bio?: string;
  experience?: string;
  equipment?: string[];

  // Status and Visibility
  status: "active" | "disabled" | "draft";
  visibility?: "public" | "private";

  // Location
  location: string;
  city?: string;
  country?: string;

  // Social Media and Links
  socialProfiles?:
    | string
    | {
        website?: string;
        instagram?: string;
        facebook?: string;
        twitter?: string;
        soundcloud?: string;
        mixcloud?: string;
        youtube?: string;
        spotify?: string;
      };

  // Performance Metrics
  eventsPlayed: number;
  rating: number;
  followers: number;
  totalPlays?: number;

  // Media
  profileImage?: string;
  backgroundImage?: string;
  playingTonight?: string[]; // Array of image URLs
  pastEventListings?: string[]; // Array of image URLs
  gallery?: string[];
  demoMixes?: Array<{
    id: string;
    title: string;
    url: string;
    duration: string;
    plays: number;
  }>;

  // Availability and Booking
  availability?: {
    isAvailable: boolean;
    bookingPrice?: number;
    currency?: string;
    minimumNotice?: number;
  };

  // Performance Details
  performanceTypes?: string[];
  venuesPlayed?: string[];
  eventsPlayedAt?: Array<{
    id: string;
    name: string;
    date: string;
    venue: string;
  }>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastActive: string;

  // Additional Metadata
  tags?: string[];
  languages?: string[];
  awards?: Array<{
    name: string;
    year: number;
    organization: string;
  }>;
  [key: string]: unknown;
}

// Simplified version for card displays
export interface DJProfileCard {
  id: string;
  name: string;
  username: string;
  genre: string;
  status: "active" | "disabled" | "draft";
  location: string;
  eventsPlayed: number;
  rating: number;
  followers: number;
  profileImage?: string;
  lastActive: string;
  socialProfiles: string; // Main social profile URL
}

// For form data when creating/editing profiles
export interface ProfileFormData {
  // Basic Information
  fullName: string;
  username: string;
  email?: string;
  phone?: string;

  // Professional Information
  genre: string;
  status: string;
  bio?: string;
  experience?: string;

  // Location
  location: string;
  city?: string;
  country?: string;

  // Social Profiles
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  soundcloud?: string;

  // Media
  profileImage?: string | null;
  backgroundImage?: string | null;

  // Additional
  playingTonight?: string;
}

// For API responses
export interface ProfileResponse {
  success: boolean;
  data: Profile;
  message?: string;
}

export interface ProfilesResponse {
  success: boolean;
  data: Profile[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

// For filters and search
export interface ProfileFilters {
  status?: string[];
  genre?: string[];
  location?: string;
  rating?: number;
  searchQuery?: string;
}

// For statistics
export interface ProfileStats {
  total: number;
  active: number;
  disabled: number;
  drafts: number;
  averageRating: number;
  totalFollowers: number;
  totalEvents: number;
}

// For the DJ cards component props
export interface DJProfileCardsProps {
  profiles: Profile[];
  layout?: "grid" | "list";
  onLayoutChange?: (layout: "grid" | "list") => void;
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: string) => void;
  onGenreFilter?: (genre: string) => void;
  onEditProfile?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  onDeleteProfile?: (profile: Profile) => void;
  searchValue?: string;
  selectedStatus?: string;
  selectedGenre?: string;
  className?: string;
  loading?: boolean;
}
