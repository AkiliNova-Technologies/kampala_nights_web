// hooks/useCalendarEvents.ts
import { useReduxEvents } from "./useReduxEvents";
import { useMemo } from "react";

// Local type definitions for the calendar
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  color: string;
  category: string;
  attendees: string[];
  tags: string[];
}

export function useCalendarEvents(mode: "admin" | "business" = "admin") {
  const { events: realEvents, loading, error, fetchEvents } = useReduxEvents({ 
    mode, 
    autoLoad: true 
  });

  const calendarEvents = useMemo(() => {
    if (!realEvents || realEvents.length === 0) {
      return [];
    }

    return realEvents.map(apiEvent => {
      // Helper function to get event color
      const getEventColor = (eventType: string, status: string): string => {
        const colorMap: Record<string, string> = {
          party: "purple",
          music: "blue", 
          vip: "orange",
          art: "green",
          social: "pink",
          meeting: "blue",
          task: "green",
          personal: "pink",
          reminder: "yellow",
          conference: "indigo",
          workshop: "teal"
        };

        const statusColorMap: Record<string, string> = {
          PENDING: "yellow",
          APPROVED: "green", 
          REJECTED: "red",
          COMPLETED: "gray",
          CANCELLED: "red",
          LIVE: "blue"
        };

        return colorMap[eventType?.toLowerCase()] || statusColorMap[status] || "blue";
      };

      // Helper function to extract attendees
      const getAttendees = (event: any): string[] => {
        if (event.checkIns && event.checkIns.length > 0) {
          return event.checkIns
            .filter((checkIn: any) => checkIn.status === "CHECKED_IN")
            .map((checkIn: any) => checkIn.name)
            .slice(0, 3);
        }
        
        // Fallback: use ticket sales if available
        if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
          const totalSold = event.eventTicketTypes.reduce((sum: number, ticket: any) => 
            sum + ticket.soldCount, 0);
          return totalSold > 0 ? [`${totalSold} attendees`] : [];
        }
        
        return [];
      };

      // Helper function to generate tags
      const getEventTags = (event: any): string[] => {
        const tags: string[] = [];
        
        // Add status-based tags
        if (event.status === "APPROVED") tags.push("Approved");
        if (event.status === "PENDING") tags.push("Pending");
        if (event.status === "REJECTED") tags.push("Rejected");
        if (event.status === "LIVE") tags.push("Live");
        if (event.status === "COMPLETED") tags.push("Completed");
        
        // Add payment type tags
        if (event.isPaid) {
          tags.push("Paid");
        } else {
          tags.push("Free");
        }
        
        // Add capacity tags
        const totalSold = event.eventTicketTypes?.reduce((sum: number, ticket: any) => 
          sum + (ticket.soldCount || 0), 0) || 0;
        const percentage = event.maxAttendees > 0 ? (totalSold / event.maxAttendees) * 100 : 0;
        
        if (percentage > 80) tags.push("High Demand");
        if (event.maxAttendees - totalSold < 10) tags.push("Almost Full");
        if (event.allowReservations) tags.push("Reservations");
        
        // Add event type as tag
        if (event.eventType) {
          tags.push(event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1));
        }
        
        return tags;
      };

      return {
        id: apiEvent.id,
        title: apiEvent.name || "Untitled Event",
        description: apiEvent.description || "No description available",
        startTime: new Date(apiEvent.startDateTime),
        endTime: new Date(apiEvent.endDateTime),
        color: getEventColor(apiEvent.eventType, apiEvent.status),
        category: apiEvent.eventType || "General",
        attendees: getAttendees(apiEvent),
        tags: getEventTags(apiEvent),
      } as CalendarEvent;
    });
  }, [realEvents]);

  return {
    calendarEvents,
    loading,
    error,
    refetch: fetchEvents,
    hasEvents: calendarEvents.length > 0
  };
}