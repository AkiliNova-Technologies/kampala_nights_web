export type EventStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";

// Type definitions
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

// Group Pricing Interface - Consistent with CapacityPricing component
export interface GroupPricing {
  id: string;
  group1_3: number;
  group4_6: number;
  group7_10: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
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
  
  // Ticket Information - For paid events
  eventTicketTypes: EventTicketType[];
  
  // Group Pricing Information - For free events with reservations
  groupPricing: GroupPricing[];
  
  // Media Gallery
  eventmedia: EventMedia[];
  
  // Additional Fields
  rejectionDate?: string;
  rejectionReason?: string;
  revenue?: string;
  
  // Analytics and Engagement Data
  vibeData?: VibeDataPoint[];
  checkIns?: CheckIn[];
  activityLog?: ActivityLog[];
  liveGallery?: LiveGalleryImage[];
  
  [key: string]: unknown;
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
    price: apiEvent.isPaid 
      ? apiEvent.eventTicketTypes.length > 0 
        ? `${apiEvent.eventTicketTypes[0].price}` 
        : '0'
      : apiEvent.groupPricing.length > 0
        ? `${Math.min(apiEvent.groupPricing[0].group1_3, apiEvent.groupPricing[0].group4_6, apiEvent.groupPricing[0].group7_10)}`
        : '0',
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
  const groupPricing = event.groupPricing?.[0];
  
  return {
    id: event.id,
    title: event.name,
    description: event.description,
    date: new Date(event.startDateTime).toLocaleDateString(),
    time: new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location,
    attendees: `${event.maxAttendees}`,
    price: event.isPaid 
      ? event.eventTicketTypes.length > 0 
        ? `UGX ${event.eventTicketTypes[0].price.toLocaleString()}` 
        : 'Free'
      : groupPricing 
        ? `From UGX ${Math.min(groupPricing.group1_3, groupPricing.group4_6, groupPricing.group7_10).toLocaleString()}`
        : 'Free',
    status: adaptEventStatus(event.status),
    category: event.eventType,
    imageUrl: event.coverImageUrl || event.backgroundImageUrl,
    totalTickets: event.eventTicketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0),
    soldTickets: event.eventTicketTypes.reduce((sum, ticket) => sum + ticket.soldCount, 0),
    revenue: event.eventTicketTypes.reduce((total, ticket) => total + (ticket.price * ticket.soldCount), 0),
    groupPricing: groupPricing
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

// Helper functions for group pricing
export const getGroupPricingDisplay = (groupPricing: GroupPricing) => {
  return {
    group1_3: `UGX ${groupPricing.group1_3.toLocaleString()}`,
    group4_6: `UGX ${groupPricing.group4_6.toLocaleString()}`,
    group7_10: `UGX ${groupPricing.group7_10.toLocaleString()}`
  };
};

export const hasGroupPricing = (event: Event): boolean => {
  return !event.isPaid && 
         event.groupPricing?.length > 0 && 
         event.groupPricing[0] !== undefined;
};

export const getActiveGroupPricing = (event: Event): GroupPricing | null => {
  if (!hasGroupPricing(event)) return null;
  
  const activePricing = event.groupPricing.find(pricing => pricing.isActive);
  return activePricing || event.groupPricing[0] || null;
};

// Check if event has any pricing configured
export const hasPricing = (event: Event): boolean => {
  return event.isPaid 
    ? event.eventTicketTypes.length > 0
    : event.groupPricing.length > 0;
};

// Get the minimum price for display
export const getMinimumPrice = (event: Event): number => {
  if (event.isPaid && event.eventTicketTypes.length > 0) {
    return Math.min(...event.eventTicketTypes.map(ticket => ticket.price));
  }
  
  if (!event.isPaid && event.groupPricing.length > 0) {
    const pricing = event.groupPricing[0];
    return Math.min(pricing.group1_3, pricing.group4_6, pricing.group7_10);
  }
  
  return 0;
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

export const isGroupPricing = (item: unknown): item is GroupPricing => {
  return typeof item === 'object' && 
         item !== null && 
         'group1_3' in item && 
         'group4_6' in item && 
         'group7_10' in item;
};

// Default group pricing for new events
export const DEFAULT_GROUP_PRICING: GroupPricing = {
  id: '',
  group1_3: 0,
  group4_6: 0,
  group7_10: 0,
  isActive: true,
  createdAt: new Date().toISOString()
};

// Pricing logic helpers
export const getPricingType = (event: Event): 'tickets' | 'groups' | 'free' => {
  if (event.isPaid && event.eventTicketTypes.length > 0) {
    return 'tickets';
  }
  if (!event.isPaid && event.groupPricing.length > 0) {
    return 'groups';
  }
  return 'free';
};

// Calculate total capacity usage
export const getCapacityUsage = (event: Event): { used: number; remaining: number; percentage: number } => {
  const totalSold = event.eventTicketTypes.reduce((sum, ticket) => sum + ticket.soldCount, 0);
  const remaining = Math.max(0, event.maxAttendees - totalSold);
  const percentage = event.maxAttendees > 0 ? (totalSold / event.maxAttendees) * 100 : 0;
  
  return {
    used: totalSold,
    remaining,
    percentage
  };
};