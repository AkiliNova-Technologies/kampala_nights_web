import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getEvents,
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
} from "@/redux/slices/eventSlice";
import type {
  Event,
} from "@/redux/slices/eventSlice";
import type { RootState } from "@/redux/store";
import { useCallback, useEffect, useRef } from "react";

export function useReduxEvents() {
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
  } = eventState;

  useEffect(() => {
    if (!hasInitialized.current) {
      console.log("🔄 Loading events from cache...");
      dispatch(loadEventsFromCache());
      hasInitialized.current = true;
    }
  }, [dispatch]);

  const fetchEvents = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      forceRefresh?: boolean;
      background?: boolean;
    }) => {
      console.log("📦 Fetching events with params:", params);
      return dispatch(getEvents(params || {}));
    },
    [dispatch]
  );

  const fetchEventById = useCallback(
    (eventId: string) => dispatch(getEventById(eventId)),
    [dispatch]
  );

  const updateEventData = useCallback(
    (id: string, eventData: Partial<Event>) =>
      dispatch(updateEvent({ id, eventData })),
    [dispatch]
  );

  const deleteEventById = useCallback(
    (eventId: string) => dispatch(deleteEvent(eventId)),
    [dispatch]
  );

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
    (eventData: Partial<Event>) =>
      dispatch(updateEventLocal(eventData)),
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

  const pendingEvents = events.filter(event => event.status === "PENDING");
  const approvedEvents = events.filter(event => event.status === "APPROVED");
  const rejectedEvents = events.filter(event => event.status === "REJECTED");
  const completedEvents = events.filter(event => event.status === "COMPLETED");

  return {
    // State
    events,
    currentEvent,
    loading,
    error,
    pagination,
    lastFetched,

    // Filtered events
    pendingEvents,
    approvedEvents,
    rejectedEvents,
    completedEvents,

    // Actions
    getEvents: fetchEvents,
    fetchEvents,
    fetchEventById,
    updateEventData,
    deleteEvent: deleteEventById,
    approveEvent: approveEventById,
    rejectEvent: rejectEventById,
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
  };
}