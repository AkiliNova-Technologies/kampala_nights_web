import { useState } from "react";
import type { Event, EventStatus } from "@/types/event";
import Event1 from "@/assets/images/event1.png";
import Event2 from "@/assets/images/event2.png";
import Event3 from "@/assets/images/event3.png";
import live1 from "@/assets/images/live1.jpg";
import live2 from "@/assets/images/live2.jpg";
import live3 from "@/assets/images/live3.jpg";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Saturday Night Fever",
      description:
        "The ultimate nightclub experience with world-class DJs, premium bottle service, and an unforgettable atmosphere.",
      startDateTime: "2025-10-27T22:00:00.000Z",
      endDateTime: "2025-10-28T04:00:00.000Z",
      maxAttendees: 500,
      eventType: "party",
      location: "Kololo, Kampala",
      latitude: 0.3276,
      longitude: 32.5825,
      backgroundImageUrl: Event1,
      coverImageUrl: Event1,
      status: "PENDING",
      isApproved: false,
      isActive: true,
      isPaid: true, // Paid event with tickets
      allowReservations: true,
      createdAt: "2025-01-15T14:30:00.000Z",
      
      // Ticket-based pricing for paid event
      eventTicketTypes: [
        {
          id: "ticket-1-1",
          name: "VIP Entry",
          price: 150000,
          quantity: 50,
          soldCount: 45,
          isActive: true,
          createdAt: "2025-01-15T14:30:00.000Z",
        },
        {
          id: "ticket-1-2",
          name: "Regular Entry",
          price: 75000,
          quantity: 450,
          soldCount: 405,
          isActive: true,
          createdAt: "2025-01-15T14:30:00.000Z",
        },
      ],
      
      // Group pricing for free events (empty for paid events)
      groupPricing: [],
      
      eventmedia: [
        {
          id: "media-1-1",
          type: "IMAGE",
          position: 0,
          url: Event1,
          storageKey: "events/saturday-night-1.jpg",
          width: 1200,
          height: 800,
          durationSec: null,
        },
      ],
      
      vibeData: [
        { time: "10pm", vibe: 85 },
        { time: "11pm", vibe: 92 },
        { time: "12am", vibe: 78 },
        { time: "1am", vibe: 88 },
        { time: "2am", vibe: 95 },
        { time: "3am", vibe: 82 },
        { time: "4am", vibe: 90 },
      ],
      
      checkIns: [
        {
          id: "checkin-1-1",
          name: "Sarah Nakito",
          time: "2 mins ago",
          userId: "user-123",
          ticketId: "ticket-1-1",
          ticketType: "VIP Entry",
          checkedInAt: "2025-10-27T22:02:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-1-2",
          name: "Gloria Karungi",
          time: "5 mins ago",
          userId: "user-124",
          ticketId: "ticket-1-2",
          ticketType: "Regular Entry",
          checkedInAt: "2025-10-27T21:59:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-1-3",
          name: "Jude Okello",
          time: "15 mins ago",
          userId: "user-125",
          ticketId: "ticket-1-1",
          ticketType: "VIP Entry",
          checkedInAt: "2025-10-27T21:49:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-1-4",
          name: "Jose Paul",
          time: "15 mins ago",
          userId: "user-126",
          ticketId: "ticket-1-2",
          ticketType: "Regular Entry",
          checkedInAt: "2025-10-27T21:49:00.000Z",
          status: "CHECKED_IN",
        },
      ],
      
      activityLog: [
        {
          id: "activity-1-1",
          action: "Event submitted for approval",
          timestamp: "January 15, 2025 at 2:30 PM",
          userId: "user-owner-1",
          userName: "Event Owner",
          type: "CREATION",
          details: { previousStatus: null, newStatus: "PENDING" },
        },
        {
          id: "activity-1-2",
          action: "Event details updated",
          timestamp: "January 14, 2025 at 10:15 AM",
          userId: "user-owner-1",
          userName: "Event Owner",
          type: "UPDATE",
          details: { updatedFields: ["description", "maxAttendees"] },
        },
        {
          id: "activity-1-3",
          action: "VIP ticket added",
          timestamp: "January 13, 2025 at 3:45 PM",
          userId: "user-owner-1",
          userName: "Event Owner",
          type: "UPDATE",
          details: { ticketType: "VIP Entry", price: 150000 },
        },
      ],
    },
    {
      id: "2",
      name: "Acoustic Night",
      description:
        "Intimate acoustic session with local artists and craft cocktails.",
      startDateTime: "2025-10-25T20:00:00.000Z",
      endDateTime: "2025-10-26T00:00:00.000Z",
      maxAttendees: 150,
      eventType: "music",
      location: "Kololo, Kampala",
      latitude: 0.3276,
      longitude: 32.5825,
      backgroundImageUrl: Event2,
      coverImageUrl: Event2,
      status: "APPROVED",
      isApproved: true,
      isActive: true,
      isPaid: true, // Paid event with single ticket type
      allowReservations: false,
      createdAt: "2025-01-10T09:15:00.000Z",
      approvedAt: "2025-01-12T14:20:00.000Z",
      approvedBy: "admin-1",
      
      // Single ticket type for paid event
      eventTicketTypes: [
        {
          id: "ticket-2-1",
          name: "General Admission",
          price: 50000,
          quantity: 150,
          soldCount: 120,
          isActive: true,
          createdAt: "2025-01-10T09:15:00.000Z",
        },
      ],
      
      // No group pricing for paid events
      groupPricing: [],
      
      eventmedia: [
        {
          id: "media-2-1",
          type: "IMAGE",
          position: 0,
          url: Event2,
          storageKey: "events/acoustic-night-1.jpg",
          width: 1200,
          height: 800,
          durationSec: null,
        },
      ],
      
      activityLog: [
        {
          id: "activity-2-1",
          action: "Event submitted for approval",
          timestamp: "January 10, 2025 at 9:15 AM",
          userId: "user-owner-2",
          userName: "Music Venue Manager",
          type: "CREATION",
          details: { previousStatus: null, newStatus: "PENDING" },
        },
        {
          id: "activity-2-2",
          action: "Event approved by admin",
          timestamp: "January 12, 2025 at 2:20 PM",
          userId: "admin-1",
          userName: "System Admin",
          type: "STATUS_CHANGE",
          details: { previousStatus: "PENDING", newStatus: "APPROVED" },
        },
        {
          id: "activity-2-3",
          action: "Event details updated",
          timestamp: "January 14, 2025 at 10:15 AM",
          userId: "user-owner-2",
          userName: "Music Venue Manager",
          type: "UPDATE",
          details: { updatedFields: ["startDateTime", "endDateTime"] },
        },
      ],
      
      checkIns: [
        {
          id: "checkin-2-1",
          name: "David Musinguzi",
          time: "1 hour ago",
          userId: "user-201",
          ticketId: "ticket-2-1",
          ticketType: "General Admission",
          checkedInAt: "2025-10-25T19:15:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-2-2",
          name: "Grace Nalwanga",
          time: "45 mins ago",
          userId: "user-202",
          ticketId: "ticket-2-1",
          ticketType: "General Admission",
          checkedInAt: "2025-10-25T19:30:00.000Z",
          status: "CHECKED_IN",
        },
      ],
    },
    {
      id: "3",
      name: "VIP Lounge Experience",
      description:
        "Exclusive VIP experience with premium cocktails and live entertainment.",
      startDateTime: "2025-10-29T22:00:00.000Z",
      endDateTime: "2025-10-30T04:00:00.000Z",
      maxAttendees: 150,
      eventType: "vip",
      location: "Kololo, Kampala",
      latitude: 0.3276,
      longitude: 32.5825,
      backgroundImageUrl: Event3,
      coverImageUrl: Event3,
      status: "COMPLETED",
      isApproved: true,
      isActive: true,
      isPaid: false, // FREE event with group pricing
      allowReservations: true,
      createdAt: "2025-01-05T11:20:00.000Z",
      approvedAt: "2025-01-07T16:45:00.000Z",
      approvedBy: "admin-1",
      
      // No tickets for free events
      eventTicketTypes: [],
      
      // Group pricing for free event with reservations
      groupPricing: [
        {
          id: "group-3-1",
          group1_3: 300000,  // 1-3 people: 300,000 UGX
          group4_6: 500000,  // 4-6 people: 500,000 UGX
          group7_10: 700000, // 7-10 people: 700,000 UGX
          isActive: true,
          createdAt: "2025-01-05T11:20:00.000Z",
        },
      ],
      
      eventmedia: [
        {
          id: "media-3-1",
          type: "IMAGE",
          position: 0,
          url: Event3,
          storageKey: "events/vip-lounge-1.jpg",
          width: 1200,
          height: 800,
          durationSec: null,
        },
      ],
      
      vibeData: [
        { time: "10pm", vibe: 85 },
        { time: "11pm", vibe: 92 },
        { time: "12am", vibe: 78 },
        { time: "1am", vibe: 88 },
        { time: "2am", vibe: 95 },
        { time: "3am", vibe: 82 },
        { time: "4am", vibe: 90 },
      ],
      
      checkIns: [
        {
          id: "checkin-3-1",
          name: "Sarah Nakito",
          time: "2 mins ago",
          userId: "user-301",
          ticketId: "ticket-3-1",
          ticketType: "VIP Package",
          checkedInAt: "2025-10-29T22:02:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-3-2",
          name: "Gloria Karungi",
          time: "5 mins ago",
          userId: "user-302",
          ticketId: "ticket-3-1",
          ticketType: "VIP Package",
          checkedInAt: "2025-10-29T21:59:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-3-3",
          name: "Jude Okello",
          time: "15 mins ago",
          userId: "user-303",
          ticketId: "ticket-3-1",
          ticketType: "VIP Package",
          checkedInAt: "2025-10-29T21:49:00.000Z",
          status: "CHECKED_IN",
        },
        {
          id: "checkin-3-4",
          name: "Jose Paul",
          time: "15 mins ago",
          userId: "user-304",
          ticketId: "ticket-3-1",
          ticketType: "VIP Package",
          checkedInAt: "2025-10-29T21:49:00.000Z",
          status: "CHECKED_IN",
        },
      ],
      
      activityLog: [
        {
          id: "activity-3-1",
          action: "Event submitted for approval",
          timestamp: "January 5, 2025 at 11:20 AM",
          userId: "user-owner-3",
          userName: "VIP Lounge Manager",
          type: "CREATION",
          details: { previousStatus: null, newStatus: "PENDING" },
        },
        {
          id: "activity-3-2",
          action: "Event approved by admin",
          timestamp: "January 7, 2025 at 4:45 PM",
          userId: "admin-1",
          userName: "System Admin",
          type: "STATUS_CHANGE",
          details: { previousStatus: "PENDING", newStatus: "APPROVED" },
        },
        {
          id: "activity-3-3",
          action: "Group pricing added",
          timestamp: "January 8, 2025 at 10:30 AM",
          userId: "user-owner-3",
          userName: "VIP Lounge Manager",
          type: "UPDATE",
          details: { 
            group1_3: 300000, 
            group4_6: 500000, 
            group7_10: 700000 
          },
        },
        {
          id: "activity-3-4",
          action: "Event marked as completed",
          timestamp: "October 30, 2025 at 6:00 AM",
          userId: "system",
          userName: "System",
          type: "STATUS_CHANGE",
          details: { previousStatus: "LIVE", newStatus: "COMPLETED" },
        },
      ],
      
      liveGallery: [
        {
          id: "gallery-3-1",
          url: live1,
          thumbnailUrl: live1,
          uploadTime: "2025-10-29T23:15:00.000Z",
          uploadedBy: "user-owner-3",
          caption: "VIP section buzzing",
          type: "IMAGE",
          storageKey: "gallery/vip-lounge-1.jpg",
          width: 1200,
          height: 800,
        },
        {
          id: "gallery-3-2",
          url: live2,
          thumbnailUrl: live2,
          uploadTime: "2025-10-30T00:30:00.000Z",
          uploadedBy: "user-owner-3",
          caption: "Live performance",
          type: "IMAGE",
          storageKey: "gallery/vip-lounge-2.jpg",
          width: 1200,
          height: 800,
        },
        {
          id: "gallery-3-3",
          url: live3,
          thumbnailUrl: live3,
          uploadTime: "2025-10-30T02:15:00.000Z",
          uploadedBy: "user-owner-3",
          caption: "Crowd enjoying the night",
          type: "IMAGE",
          storageKey: "gallery/vip-lounge-3.jpg",
          width: 1200,
          height: 800,
        },
      ],
    },
    {
      id: "4",
      name: "Community Art Exhibition",
      description: "Free art exhibition showcasing local artists with live demonstrations.",
      startDateTime: "2025-11-05T10:00:00.000Z",
      endDateTime: "2025-11-05T18:00:00.000Z",
      maxAttendees: 200,
      eventType: "art",
      location: "National Theatre, Kampala",
      latitude: 0.3163,
      longitude: 32.5822,
      backgroundImageUrl: Event1,
      coverImageUrl: Event1,
      status: "APPROVED",
      isApproved: true,
      isActive: true,
      isPaid: false, // FREE event without reservations
      allowReservations: false,
      createdAt: "2025-01-20T08:00:00.000Z",
      approvedAt: "2025-01-22T11:30:00.000Z",
      approvedBy: "admin-1",
      
      // No tickets for free events
      eventTicketTypes: [],
      
      // No group pricing for free events without reservations
      groupPricing: [],
      
      eventmedia: [
        {
          id: "media-4-1",
          type: "IMAGE",
          position: 0,
          url: Event1,
          storageKey: "events/art-exhibition-1.jpg",
          width: 1200,
          height: 800,
          durationSec: null,
        },
      ],
      
      activityLog: [
        {
          id: "activity-4-1",
          action: "Event submitted for approval",
          timestamp: "January 20, 2025 at 8:00 AM",
          userId: "user-owner-4",
          userName: "Art Gallery Manager",
          type: "CREATION",
          details: { previousStatus: null, newStatus: "PENDING" },
        },
        {
          id: "activity-4-2",
          action: "Event approved by admin",
          timestamp: "January 22, 2025 at 11:30 AM",
          userId: "admin-1",
          userName: "System Admin",
          type: "STATUS_CHANGE",
          details: { previousStatus: "PENDING", newStatus: "APPROVED" },
        },
      ],
      
      checkIns: [
        {
          id: "checkin-4-1",
          name: "Maria Nalubega",
          time: "30 mins ago",
          userId: "user-401",
          checkedInAt: "2025-11-05T10:30:00.000Z",
          status: "CHECKED_IN",
        },
      ],
    },
    {
      id: "6",
      name: "Rooftop Sundowner",
      description: "Sunset drinks with panoramic city views and chill vibes.",
      startDateTime: "2025-09-15T17:00:00.000Z",
      endDateTime: "2025-09-15T21:00:00.000Z",
      maxAttendees: 80,
      eventType: "social",
      location: "City Center, Kampala",
      latitude: 0.3136,
      longitude: 32.5811,
      backgroundImageUrl: Event1,
      coverImageUrl: Event1,
      status: "REJECTED",
      isApproved: false,
      isActive: false,
      isPaid: false, // FREE event (rejected)
      allowReservations: false,
      createdAt: "2025-09-10T08:45:00.000Z",
      rejectionReason:
        "This event does not comply with our community guidelines regarding noise regulations and crowd management protocols. The venue capacity exceeds the permitted limit for this location, and the proposed sound levels violate local ordinances.",
      rejectionDate: "October 25, 2025 at 2:30 PM",
      
      // No tickets for rejected free event
      eventTicketTypes: [],
      
      // No group pricing for rejected event
      groupPricing: [],
      
      eventmedia: [
        {
          id: "media-6-1",
          type: "IMAGE",
          position: 0,
          url: Event1,
          storageKey: "events/rooftop-sundowner-1.jpg",
          width: 1200,
          height: 800,
          durationSec: null,
        },
      ],
      
      activityLog: [
        {
          id: "activity-6-1",
          action: "Event submitted for approval",
          timestamp: "September 10, 2025 at 8:45 AM",
          userId: "user-owner-6",
          userName: "Rooftop Venue Manager",
          type: "CREATION",
          details: { previousStatus: null, newStatus: "PENDING" },
        },
        {
          id: "activity-6-2",
          action: "Event rejected by admin",
          timestamp: "October 25, 2025 at 2:30 PM",
          userId: "admin-1",
          userName: "System Admin",
          type: "STATUS_CHANGE",
          details: {
            previousStatus: "PENDING",
            newStatus: "REJECTED",
            rejectionReason:
              "This event does not comply with our community guidelines regarding noise regulations and crowd management protocols.",
          },
        },
      ],
      
      checkIns: [], // No check-ins for rejected event
    },
  ]);

  const updateEventStatus = (
    eventId: string,
    status: EventStatus,
    rejectionReason?: string
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: status as any,
              ...(rejectionReason && {
                rejectionReason,
                rejectionDate: new Date().toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
              }),
              ...(status === "APPROVED" && {
                isApproved: true,
                approvedAt: new Date().toISOString(),
              }),
              ...(status === "REJECTED" && {
                isApproved: false,
                isActive: false,
              }),
            }
          : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const getEventById = (eventId: string) => {
    return events.find((event) => event.id === eventId);
  };

  return {
    events,
    updateEventStatus,
    deleteEvent,
    getEventById,
  };
}