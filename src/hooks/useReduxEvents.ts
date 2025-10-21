import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAdminEvents,
  getBusinessEvents,
  createBusinessEvent,
  getBusinessEventById,
  updateBusinessEvent,
  deleteBusinessEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
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
} from "@/redux/slices/eventSlice";
import type {
  CreateEventData,
  UpdateEventData,
} from "@/redux/slices/eventSlice";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useRef } from "react";
import type { Event } from "@/types/event";

interface UseReduxEventsOptions {
  mode?: "admin" | "business";
  autoLoad?: boolean;
}

export function useReduxEvents(options: UseReduxEventsOptions = {}) {
  const { mode = "admin", autoLoad = true } = options;

  const dispatch = useAppDispatch();
  const eventState = useAppSelector((state: RootState) => state.event);
  const hasInitialized = useRef(false);

  const {
    events = [],
    currentEvent = null,
    loading = false,
    error = null,
    pagination = {
      page: 0,
      limit: 0,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    lastFetched = null,
    mode: currentMode,
  } = eventState;

  // Set mode on mount and when mode prop changes
  useEffect(() => {
    if (currentMode !== mode) {
      dispatch(setEventMode(mode));
    }
  }, [dispatch, mode, currentMode]);

  useEffect(() => {
    if (autoLoad && !hasInitialized.current) {
      console.log(`🔄 Loading ${mode} events from cache...`);
      dispatch(loadEventsFromCache());
      hasInitialized.current = true;
    }
  }, [dispatch, mode, autoLoad]);

  // Admin actions
  const fetchAdminEvents = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      background?: boolean;
    }) => {
      console.log("📦 Fetching admin events with params:", params);
      return dispatch(getAdminEvents(params || {}));
    },
    [dispatch]
  );

  // Business actions
  const fetchBusinessEvents = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      background?: boolean;
    }) => {
      console.log("📦 Fetching business events with params:", params);
      return dispatch(getBusinessEvents(params || {}));
    },
    [dispatch]
  );

  const createEvent = useCallback(
    (eventData: CreateEventData) => dispatch(createBusinessEvent(eventData)),
    [dispatch]
  );

  const fetchBusinessEventById = useCallback(
    (eventId: string) => dispatch(getBusinessEventById(eventId)),
    [dispatch]
  );

  const updateBusinessEventData = useCallback(
    (id: string, eventData: UpdateEventData) =>
      dispatch(updateBusinessEvent({ id, eventData })),
    [dispatch]
  );

  const deleteBusinessEventById = useCallback(
    (eventId: string) => dispatch(deleteBusinessEvent(eventId)),
    [dispatch]
  );

  // Common actions (work for both modes)
  const fetchEventById = useCallback(
    (eventId: string) => {
      if (currentMode === "business") {
        return dispatch(getBusinessEventById(eventId));
      }
      return dispatch(getEventById(eventId));
    },
    [dispatch, currentMode]
  );

  const updateEventData = useCallback(
    (id: string, eventData: Partial<Event> | UpdateEventData) => {
      if (currentMode === "business") {
        return dispatch(
          updateBusinessEvent({ id, eventData: eventData as UpdateEventData })
        );
      }
      return dispatch(
        updateEvent({ id, eventData: eventData as Partial<Event> })
      );
    },
    [dispatch, currentMode]
  );

  const deleteEventById = useCallback(
    (eventId: string) => {
      if (currentMode === "business") {
        return dispatch(deleteBusinessEvent(eventId));
      }
      return dispatch(deleteEvent(eventId));
    },
    [dispatch, currentMode]
  );

  // Mode switching
  const switchToAdmin = useCallback(
    () => dispatch(switchToAdminMode()),
    [dispatch]
  );

  const switchToBusiness = useCallback(
    () => dispatch(switchToBusinessMode()),
    [dispatch]
  );

  // Keep existing common actions
  const approveEventById = useCallback(
    (eventId: string) => dispatch(approveEvent(eventId)),
    [dispatch]
  );

  const rejectEventById = useCallback(
    (eventId: string, rejectionReason?: string) =>
      dispatch(rejectEvent({ eventId, rejectionReason })),
    [dispatch]
  );

  const setCurrentEventData = useCallback(
    (event: Event | null) => dispatch(setCurrentEvent(event)),
    [dispatch]
  );

  const updateEventLocally = useCallback(
    (eventData: Partial<Event>) => dispatch(updateEventLocal(eventData)),
    [dispatch]
  );

  const clearEventErrorState = useCallback(
    () => dispatch(clearEventError()),
    [dispatch]
  );

  const clearEventsData = useCallback(
    () => dispatch(clearEvents()),
    [dispatch]
  );

  const refreshEventsData = useCallback(
    () => dispatch(refreshEvents()),
    [dispatch]
  );

  const removeEventFromLocalState = useCallback(
    (eventId: string) => dispatch(removeEventFromState(eventId)),
    [dispatch]
  );

  // Smart fetch that uses current mode
  const fetchEvents = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      background?: boolean;
    }) => {
      if (currentMode === "business") {
        return fetchBusinessEvents(params);
      }
      return fetchAdminEvents(params);
    },
    [currentMode, fetchBusinessEvents, fetchAdminEvents]
  );

  const pendingEvents = events.filter((event) => event.status === "PENDING");
  const approvedEvents = events.filter((event) => event.status === "APPROVED");
  const rejectedEvents = events.filter((event) => event.status === "REJECTED");
  const completedEvents = events.filter(
    (event) => event.status === "COMPLETED"
  );

  return {
    // State
    events,
    currentEvent,
    loading,
    error,
    pagination,
    lastFetched,
    mode: currentMode,

    // Filtered events
    pendingEvents,
    approvedEvents,
    rejectedEvents,
    completedEvents,

    // Mode-specific actions
    fetchAdminEvents,
    fetchBusinessEvents,
    createEvent,
    fetchBusinessEventById,
    updateBusinessEvent: updateBusinessEventData,
    deleteBusinessEvent: deleteBusinessEventById,

    // Common actions (auto-detect mode)
    getEvents: fetchEvents,
    fetchEvents,
    fetchEventById,
    updateEventData,
    deleteEvent: deleteEventById,
    approveEvent: approveEventById,
    rejectEvent: rejectEventById,

    // Mode management
    switchToAdmin,
    switchToBusiness,
    setEventMode: (mode: "admin" | "business") => dispatch(setEventMode(mode)),

    // Local state actions
    setCurrentEvent: setCurrentEventData,
    updateEventLocal: updateEventLocally,
    clearError: clearEventErrorState,
    clearEvents: clearEventsData,
    refreshEvents: refreshEventsData,
    removeEventFromState: removeEventFromLocalState,

    // Status flags
    hasData: events.length > 0,
    hasPendingEvents: pendingEvents.length > 0,
    hasApprovedEvents: approvedEvents.length > 0,
    hasRejectedEvents: rejectedEvents.length > 0,
    isAdminMode: currentMode === "admin",
    isBusinessMode: currentMode === "business",
  };
}
