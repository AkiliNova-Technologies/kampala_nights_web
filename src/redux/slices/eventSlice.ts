import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface Event {
  id: string;
  venueId: string;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxAttendees: number;
  ticketPrice: number;
  eventType: string;
  backgroundImageUrl?: string;
  coverImageUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  venue: {
    id: string;
    businessAccountId: string;
    name: string;
    description: string;
    address: string;
    type: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    businessAccount: {
      id: string;
      baseUserId: string;
      companyName: string;
      businessType: string;
      taxId?: string;
      phone: string;
      address: string;
      status: string;
      isVerified: boolean;
      verifiedAt?: string;
      rejectionReason?: string;
      profileCompleted: boolean;
      latitude: number;
      longitude: number;
      amenities: string;
      baseUser: {
        email: string;
        firstName: string;
        lastName: string;
      };
    };
  };
  eventmedia: Array<{
    id: string;
    eventId: string;
    type: "IMAGE" | "VIDEO";
    position: number;
    storageKey: string;
    url: string;
    width?: number;
    height?: number;
    durationSec?: number;
    variants?: any;
  }>;
}

export interface EventListResponse {
  data: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  lastFetched: number | null;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    limit: 0,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  lastFetched: null,
};

const eventStorage = {
  getCachedEvents: (): {
    data: EventListResponse;
    timestamp: number;
  } | null => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("events_cache");
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error("Error reading events cache:", error);
        return null;
      }
    }
    return null;
  },

  setCachedEvents: (data: EventListResponse) => {
    if (typeof window !== "undefined") {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem("events_cache", JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving events cache:", error);
      }
    }
  },

  clearCachedEvents: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("events_cache");
      } catch (error) {
        console.error("Error clearing events cache:", error);
      }
    }
  },

  isCacheValid: (timestamp: number): boolean => {
    const CACHE_DURATION = 5 * 60 * 1000; 
    return Date.now() - timestamp < CACHE_DURATION;
  },
};

export const getEvents = createAsyncThunk(
  "event/getEvents",
  async (
    {
      page = 1,
      limit = 10,
      forceRefresh = false,
    }: { page?: number; limit?: number; forceRefresh?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      if (!forceRefresh) {
        const cached = eventStorage.getCachedEvents();
        if (cached && eventStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached events data");
          return cached.data;
        }
      }

      console.log("🌐 Fetching fresh events data from API");
      const response = await api.get(
        `/api/v1/admin/events?page=${page}&limit=${limit}`
      );

      eventStorage.setCachedEvents(response.data);
      console.log("Available Events: ", response.data);

      return response.data;
    } catch (error: unknown) {
      const cached = eventStorage.getCachedEvents();
      if (cached && eventStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached data as fallback");
        return cached.data;
      }

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch events";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEventById = createAsyncThunk(
  "event/getEventById",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/admin/events/${eventId}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async (
    {
      id,
      eventData,
    }: { id: string; eventData: Partial<Event> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/api/v1/admin/events/${id}`,
        eventData
      );

      eventStorage.clearCachedEvents();
      console.log("🗑️ Cleared event cache due to update");

      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (eventId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/admin/events/${eventId}`);

      eventStorage.clearCachedEvents();
      console.log("🗑️ Cleared event cache due to deletion");

      return eventId;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const approveEvent = createAsyncThunk(
  "event/approveEvent",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/v1/admin/events/${eventId}/approve`
      );

      eventStorage.clearCachedEvents();
      console.log("🗑️ Cleared event cache due to approval");

      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to approve event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const rejectEvent = createAsyncThunk(
  "event/rejectEvent",
  async (
    { eventId, rejectionReason }: { eventId: string; rejectionReason?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/api/v1/admin/events/${eventId}/reject`,
        rejectionReason ? { rejectionReason } : undefined
      );

      eventStorage.clearCachedEvents();
      console.log("🗑️ Cleared event cache due to rejection");

      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to reject event";
      return rejectWithValue(errorMessage);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.currentEvent = action.payload;
    },
    updateEventLocal: (state, action: PayloadAction<Partial<Event>>) => {
      if (state.currentEvent) {
        state.currentEvent = { ...state.currentEvent, ...action.payload };
      }
      const eventIndex = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (eventIndex !== -1) {
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...action.payload,
        };
      }
      eventStorage.clearCachedEvents();
    },
    clearEventError: (state) => {
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.pagination = initialState.pagination;
      state.lastFetched = null;
      eventStorage.clearCachedEvents();
    },
    refreshEvents: (state) => {
      state.lastFetched = null;
      eventStorage.clearCachedEvents();
    },
    loadEventsFromCache: (state) => {
      const cached = eventStorage.getCachedEvents();
      if (cached && eventStorage.isCacheValid(cached.timestamp)) {
        state.events = cached.data.data;
        state.pagination = {
          page: cached.data.page,
          limit: cached.data.limit,
          total: cached.data.total,
          totalPages: cached.data.totalPages,
          hasNext: cached.data.hasNext,
          hasPrev: cached.data.hasPrev,
        };
        state.lastFetched = cached.timestamp;
        state.loading = false;
        console.log("📦 Loaded events from cache");
      }
    },
    removeEventFromState: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          hasNext: action.payload.hasNext,
          hasPrev: action.payload.hasPrev,
        };
        state.lastFetched = Date.now();
        state.error = null;
        console.log("✅ Events loaded successfully");
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load events:", action.payload);
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        const eventIndex = state.events.findIndex(
          (event) => event.id === action.payload.id
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null;
        }
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveEvent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEvent = action.payload;
        state.currentEvent = updatedEvent;
        const eventIndex = state.events.findIndex(
          (event) => event.id === updatedEvent.id
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = updatedEvent;
        }
        state.error = null;
      })
      .addCase(approveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(rejectEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectEvent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEvent = action.payload;
        state.currentEvent = updatedEvent;
        const eventIndex = state.events.findIndex(
          (event) => event.id === updatedEvent.id
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = updatedEvent;
        }
        state.error = null;
      })
      .addCase(rejectEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentEvent,
  updateEventLocal,
  clearEventError,
  clearEvents,
  refreshEvents,
  loadEventsFromCache,
  removeEventFromState,
} = eventSlice.actions;

export default eventSlice.reducer;

export const selectEvents = (state: { event: EventState }) =>
  state.event.events;
export const selectCurrentEvent = (state: { event: EventState }) =>
  state.event.currentEvent;
export const selectEventLoading = (state: { event: EventState }) =>
  state.event.loading;
export const selectEventError = (state: { event: EventState }) =>
  state.event.error;
export const selectEventPagination = (state: { event: EventState }) =>
  state.event.pagination;
export const selectLastFetched = (state: { event: EventState }) =>
  state.event.lastFetched;

export const selectPendingEvents = (state: { event: EventState }) =>
  state.event.events.filter(event => event.status === "PENDING");
export const selectApprovedEvents = (state: { event: EventState }) =>
  state.event.events.filter(event => event.status === "APPROVED");
export const selectRejectedEvents = (state: { event: EventState }) =>
  state.event.events.filter(event => event.status === "REJECTED");
export const selectCompletedEvents = (state: { event: EventState }) =>
  state.event.events.filter(event => event.status === "COMPLETED");