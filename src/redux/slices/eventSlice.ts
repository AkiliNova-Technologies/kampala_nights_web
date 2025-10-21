import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";
import type { Event } from "@/types/event";

export interface CreateEventData {
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxAttendees: number;
  eventType: string;
  location: string;
  latitude: number;
  longitude: number;
  backgroundImageUrl?: string;
  coverImageUrl?: string;
  isPaid: boolean;
  allowReservations: boolean;
  ticketTypes: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  reservationPricing: Array<{
    optionName: string;
    price: number;
  }>;
  media: Array<{
    type: "IMAGE" | "VIDEO";
    position: number;
    url: string;
    storageKey: string;
    width?: number;
    height?: number;
    durationSec?: number;
  }>;
}

export interface UpdateEventData {
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  maxAttendees: number;
  eventType: string;
  location: string;
  latitude: number;
  longitude: number;
  backgroundImageUrl?: string;
  coverImageUrl?: string;
  isPaid: boolean;
  allowReservations: boolean;
  ticketTypes: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  reservationPricing: Array<{
    optionName: string;
    price: number;
  }>;
  media: Array<{
    type: "IMAGE" | "VIDEO";
    position: number;
    url: string;
    storageKey: string;
    width?: number;
    height?: number;
    durationSec?: number;
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
  mode: "admin" | "business"; // Track which mode we're in
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
  mode: "admin", // Default mode
};

// Storage with mode support
const eventStorage = {
  getCachedEvents: (
    mode: string
  ): {
    data: EventListResponse;
    timestamp: number;
  } | null => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`events_cache_${mode}`);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error("Error reading events cache:", error);
        return null;
      }
    }
    return null;
  },

  setCachedEvents: (data: EventListResponse, mode: string) => {
    if (typeof window !== "undefined") {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(`events_cache_${mode}`, JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving events cache:", error);
      }
    }
  },

  clearCachedEvents: (mode?: string) => {
    if (typeof window !== "undefined") {
      try {
        if (mode) {
          localStorage.removeItem(`events_cache_${mode}`);
        } else {
          // Clear all event caches
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("events_cache_")) {
              localStorage.removeItem(key);
            }
          });
        }
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

// Admin endpoints
export const getAdminEvents = createAsyncThunk(
  "event/getAdminEvents",
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
        const cached = eventStorage.getCachedEvents("admin");
        if (cached && eventStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached admin events data");
          return { ...cached.data, mode: "admin" };
        }
      }

      console.log("🌐 Fetching fresh admin events data from API");
      const response = await api.get(
        `/api/v1/admin/events?page=${page}&limit=${limit}`
      );

      eventStorage.setCachedEvents(response.data, "admin");
      console.log("Available Admin Events: ", response.data);

      return { ...response.data, mode: "admin" };
    } catch (error: unknown) {
      const cached = eventStorage.getCachedEvents("admin");
      if (cached && eventStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached admin data as fallback");
        return { ...cached.data, mode: "admin" };
      }

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch admin events";
      return rejectWithValue(errorMessage);
    }
  }
);

// Business endpoints
export const getBusinessEvents = createAsyncThunk(
  "event/getBusinessEvents",
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
        const cached = eventStorage.getCachedEvents("business");
        if (cached && eventStorage.isCacheValid(cached.timestamp)) {
          console.log("📦 Using cached business events data");
          return { ...cached.data, mode: "business" };
        }
      }

      console.log("🌐 Fetching fresh business events data from API");
      const response = await api.get(
        `/api/v1/events?page=${page}&limit=${limit}`
      );

      eventStorage.setCachedEvents(response.data, "business");
      console.log("Available Business Events: ", response.data);

      return { ...response.data, mode: "business" };
    } catch (error: unknown) {
      const cached = eventStorage.getCachedEvents("business");
      if (cached && eventStorage.isCacheValid(cached.timestamp)) {
        console.log("🔄 API failed, using cached business data as fallback");
        return { ...cached.data, mode: "business" };
      }

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch business events";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createBusinessEvent = createAsyncThunk(
  "event/createBusinessEvent",
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/events", eventData);

      eventStorage.clearCachedEvents("business");
      console.log("🗑️ Cleared business events cache due to creation");

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
        "Failed to create event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getBusinessEventById = createAsyncThunk(
  "event/getBusinessEventById",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/events/${eventId}`);
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
        "Failed to fetch business event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBusinessEvent = createAsyncThunk(
  "event/updateBusinessEvent",
  async (
    { id, eventData }: { id: string; eventData: UpdateEventData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/api/v1/events/${id}`, eventData);

      eventStorage.clearCachedEvents("business");
      console.log("🗑️ Cleared business events cache due to update");

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
        "Failed to update business event";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBusinessEvent = createAsyncThunk(
  "event/deleteBusinessEvent",
  async (eventId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/events/${eventId}`);

      eventStorage.clearCachedEvents("business");
      console.log("🗑️ Cleared business events cache due to deletion");

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
        "Failed to delete business event";
      return rejectWithValue(errorMessage);
    }
  }
);

// Keep existing admin-specific actions
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
    { id, eventData }: { id: string; eventData: Partial<Event> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/v1/admin/events/${id}`, eventData);

      eventStorage.clearCachedEvents("admin");
      console.log("🗑️ Cleared admin event cache due to update");

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

      eventStorage.clearCachedEvents("admin");
      console.log("🗑️ Cleared admin event cache due to deletion");

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
      const response = await api.put(`/api/v1/admin/events/${eventId}/approve`);

      eventStorage.clearCachedEvents("admin");
      console.log("🗑️ Cleared admin event cache due to approval");

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

      eventStorage.clearCachedEvents("admin");
      console.log("🗑️ Cleared admin event cache due to rejection");

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
      eventStorage.clearCachedEvents(state.mode);
    },
    clearEventError: (state) => {
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.pagination = initialState.pagination;
      state.lastFetched = null;
      eventStorage.clearCachedEvents(state.mode);
    },
    refreshEvents: (state) => {
      state.lastFetched = null;
      eventStorage.clearCachedEvents(state.mode);
    },
    loadEventsFromCache: (state) => {
      const cached = eventStorage.getCachedEvents(state.mode);
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
        console.log("📦 Loaded events from cache for mode:", state.mode);
      }
    },
    removeEventFromState: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
    },
    setEventMode: (state, action: PayloadAction<"admin" | "business">) => {
      state.mode = action.payload;
    },
    switchToAdminMode: (state) => {
      state.mode = "admin";
      state.events = [];
      state.currentEvent = null;
      state.pagination = initialState.pagination;
    },
    switchToBusinessMode: (state) => {
      state.mode = "business";
      state.events = [];
      state.currentEvent = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin events
      .addCase(getAdminEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mode = "admin";
      })
      .addCase(getAdminEvents.fulfilled, (state, action) => {
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
        state.mode = "admin";
        console.log("✅ Admin events loaded successfully");
      })
      .addCase(getAdminEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load admin events:", action.payload);
      })
      // Business events
      .addCase(getBusinessEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.mode = "business";
      })
      .addCase(getBusinessEvents.fulfilled, (state, action) => {
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
        state.mode = "business";
        console.log("✅ Business events loaded successfully");
      })
      .addCase(getBusinessEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Failed to load business events:", action.payload);
      })
      // Create business event
      .addCase(createBusinessEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusinessEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload); // Add new event to the beginning
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(createBusinessEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update business event
      .addCase(updateBusinessEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusinessEvent.fulfilled, (state, action) => {
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
      .addCase(updateBusinessEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete business event
      .addCase(deleteBusinessEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusinessEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null;
        }
        state.error = null;
      })
      .addCase(deleteBusinessEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Keep existing cases for admin actions
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
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
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
  setEventMode,
  switchToAdminMode,
  switchToBusinessMode,
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
export const selectEventMode = (state: { event: EventState }) =>
  state.event.mode;

export const selectPendingEvents = (state: { event: EventState }) =>
  state.event.events.filter((event) => event.status === "PENDING");
export const selectApprovedEvents = (state: { event: EventState }) =>
  state.event.events.filter((event) => event.status === "APPROVED");
export const selectRejectedEvents = (state: { event: EventState }) =>
  state.event.events.filter((event) => event.status === "REJECTED");
export const selectCompletedEvents = (state: { event: EventState }) =>
  state.event.events.filter((event) => event.status === "COMPLETED");
