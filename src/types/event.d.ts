export type EventStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";

// Add these new type definitions
export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  details?: Record<string, unknown>;
  type?: "STATUS_CHANGE" | "UPDATE" | "CREATION" | "OTHER";
}

export interface CheckIn {
  id: string;
  name: string;
  time: string;
  userId?: string;
  ticketId?: string;
  ticketType?: string;
  checkedInAt: string;
  status?: "CHECKED_IN" | "CANCELLED";
}

export interface LiveGalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  uploadTime: string;
  uploadedBy?: string;
  caption?: string;
  type?: "IMAGE" | "VIDEO";
  storageKey?: string;
  width?: number;
  height?: number;
  durationSec?: number; // for videos
}

export interface VibeDataPoint {
  time: string;
  vibe: number;
  attendees?: number;
  mood?: "HIGH" | "MEDIUM" | "LOW";
}

export interface Event {
  // Core Event Information
  id: string;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxAttendees: number;
  eventType: string;
  
  // Location Information
  location: string;
  latitude: number;
  longitude: number;
  
  // Media URLs
  backgroundImageUrl?: string;
  coverImageUrl?: string;
  
  // Status & Approval
  status: EventStatus;
  isApproved: boolean;
  isActive: boolean;
  isPaid: boolean;
  allowReservations: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  
  // Ticket Information
  eventTicketTypes: EventTicketType[];
  
  // Reservation Information
  eventReservationPricing: EventReservationPricing[];
  
  // Media Gallery
  eventmedia: EventMedia[];
  
  // Additional Fields (for your existing UI)
  rejectionDate?: string;
  rejectionReason?: string;
  revenue?: string;
  
  // Updated with proper typing
  vibeData?: VibeDataPoint[];
  checkIns?: CheckIn[];
  activityLog?: ActivityLog[];
  liveGallery?: LiveGalleryImage[];
  
  [key: string]: unknown;
}

export interface EventTicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  soldCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EventReservationPricing {
  id: string;
  optionName: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EventMedia {
  id: string;
  type: "IMAGE" | "VIDEO";
  position: number;
  url: string;
  storageKey: string;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Helper types for compatibility with your existing code
export type LocalEventStatus = "Pending" | "Approved" | "Rejected" | "Live" | "Cancelled";

// Adapter function to convert between API status and local status
export const adaptEventStatus = (status: EventStatus): LocalEventStatus => {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'APPROVED': return 'Approved';
    case 'REJECTED': return 'Rejected';
    case 'COMPLETED': return 'Live';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Pending';
  }
};

// Adapter function to convert API event to your local event format
export const adaptApiEventToLocal = (apiEvent: Event) => {
  const localEvent = {
    id: apiEvent.id,
    title: apiEvent.name,
    description: apiEvent.description,
    date: new Date(apiEvent.startDateTime).toISOString().split('T')[0],
    time: new Date(apiEvent.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: apiEvent.location,
    attendees: `${apiEvent.maxAttendees}`,
    price: apiEvent.eventTicketTypes.length > 0 ? `${apiEvent.eventTicketTypes[0].price}` : '0',
    status: adaptEventStatus(apiEvent.status),
    category: apiEvent.eventType,
    imageUrl: apiEvent.coverImageUrl,
    rejectionReason: apiEvent.status === 'REJECTED' ? 'Admin rejection' : undefined,
    revenue: apiEvent.eventTicketTypes.reduce((total, ticket) => total + (ticket.price * ticket.soldCount), 0).toString(),
    // Keep your existing optional fields with proper typing
    vibeData: apiEvent.vibeData,
    checkIns: apiEvent.checkIns,
    activityLog: apiEvent.activityLog,
    liveGallery: apiEvent.liveGallery,
    
    // Include all the API fields for full access
    ...apiEvent
  };
  
  return localEvent;
};

// Helper function to get display values
export const getEventDisplayValues = (event: Event) => {
  return {
    id: event.id,
    title: event.name,
    description: event.description,
    date: new Date(event.startDateTime).toLocaleDateString(),
    time: new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location,
    attendees: `${event.maxAttendees}`,
    price: event.eventTicketTypes.length > 0 ? `UGX ${event.eventTicketTypes[0].price.toLocaleString()}` : 'Free',
    status: adaptEventStatus(event.status),
    category: event.eventType,
    imageUrl: event.coverImageUrl || event.backgroundImageUrl,
    totalTickets: event.eventTicketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0),
    soldTickets: event.eventTicketTypes.reduce((sum, ticket) => sum + ticket.soldCount, 0),
    revenue: event.eventTicketTypes.reduce((total, ticket) => total + (ticket.price * ticket.soldCount), 0)
  };
};

// Helper functions for the new types
export const getRecentActivity = (activityLog: ActivityLog[] = [], limit?: number): ActivityLog[] => {
  const sorted = activityLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
};

export const getTotalCheckIns = (checkIns: CheckIn[] = []): number => {
  return checkIns.filter(checkIn => checkIn.status !== 'CANCELLED').length;
};

export const getGalleryImages = (liveGallery: LiveGalleryImage[] = []): LiveGalleryImage[] => {
  return liveGallery.filter(item => item.type !== 'VIDEO');
};

export const getGalleryVideos = (liveGallery: LiveGalleryImage[] = []): LiveGalleryImage[] => {
  return liveGallery.filter(item => item.type === 'VIDEO');
};

// Type guards for runtime type checking
export const isActivityLog = (item: unknown): item is ActivityLog => {
  return typeof item === 'object' && item !== null && 'action' in item && 'timestamp' in item;
};

export const isCheckIn = (item: unknown): item is CheckIn => {
  return typeof item === 'object' && item !== null && 'name' in item && 'time' in item;
};

export const isLiveGalleryImage = (item: unknown): item is LiveGalleryImage => {
  return typeof item === 'object' && item !== null && 'url' in item;
};