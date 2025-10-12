import {
  DataTable,
  type TableAction,
  type TableField,
} from "@/components/data-table";

import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EyeIcon, FilterIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReduxEvents } from "@/hooks/useReduxEvents";

// Backend Event interface based on your API response
export interface BackendEvent {
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
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
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

// UI Event interface that extends the Backend event with additional UI properties
interface UIEvent extends Omit<BackendEvent, "status"> {
  // UI-specific status that matches your tab system
  status: "active" | "pending" | "suspended" | "completed" | "cancelled";
  // Additional UI fields
  business: string;
  businessImage?: string;
  date: string;
  time: string;
  location: string;
  vibeScore: number;
  image?: string;
  [key: string]: unknown;
}

type EventStatus =
  | "active"
  | "pending"
  | "suspended"
  | "completed"
  | "cancelled";
type EventTab = "all" | "active" | "pending" | "suspended" | "past";

export function EventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EventTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>([]);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const {
    events,
    loading,
    fetchEvents,
    approveEvent,
    rejectEvent,
    deleteEvent,
    refreshEvents,
    hasData,
  } = useReduxEvents();

  useEffect(() => {
    if (!hasData && !hasFetchedInitialData && !loading) {
      console.log("🔄 Fetching events for EventsPage...");
      fetchEvents({ page: 1, limit: 50 });
      setHasFetchedInitialData(true);
    }
  }, [fetchEvents, hasData, hasFetchedInitialData, loading]);

  // Map Backend event status to UI status
  const mapEventStatus = (status: string, endDateTime: string): EventStatus => {
    const eventEnd = new Date(endDateTime);
    const now = new Date();
    const isPastEvent = eventEnd < now;

    switch (status.toUpperCase()) {
      case "APPROVED":
        return isPastEvent ? "completed" : "active";
      case "PENDING":
        return "pending";
      case "REJECTED":
        return "suspended";
      case "CANCELLED":
        return "cancelled";
      default:
        return "completed";
    }
  };

  // Transform Backend events to match UI interface
  const transformedEvents: UIEvent[] = useMemo(() => {
    return events.map((event) => {
      const finalStatus = mapEventStatus(event.status, event.endDateTime);

      // Get the first image from eventmedia for the avatar
      const firstImage = event.eventmedia?.find(
        (media) => media.type === "IMAGE"
      );
      const imageUrl =
        firstImage?.url ||
        event.coverImageUrl ||
        event.backgroundImageUrl ||
        "/api/placeholder/40/40";

      // Format date and time
      const startDate = new Date(event.startDateTime);
      const date = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const time = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        ...event,
        business: event.venue.businessAccount.companyName,
        date,
        time,
        location: event.venue.address,
        vibeScore: Math.floor(Math.random() * 30) + 70, // Random score for demo
        status: finalStatus,
        image: imageUrl,
        businessImage: "/api/placeholder/40/40", // You might want to add business images to your backend
      };
    });
  }, [events]);

  // Available status options for filter
  const statusOptions: { value: EventStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Filter events based on active tab, search query, and selected statuses
  const filteredEvents = useMemo(() => {
    let filtered = transformedEvents;

    // Apply tab filter
    switch (activeTab) {
      case "active":
        filtered = filtered.filter((event) => event.status === "active");
        break;
      case "pending":
        filtered = filtered.filter((event) => event.status === "pending");
        break;
      case "suspended":
        filtered = filtered.filter((event) => event.status === "suspended");
        break;
      case "past":
        filtered = filtered.filter((event) => event.status === "completed");
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((event) =>
        selectedStatuses.includes(event.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.business.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.venue.name.toLowerCase().includes(query) ||
          event.venue.businessAccount.companyName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transformedEvents, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: EventStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSearchQuery("");
  };

  const handleRefresh = () => {
    refreshEvents();
    fetchEvents({ page: 1, limit: 20, forceRefresh: true });
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      await approveEvent(eventId);
      // The events list will automatically refresh due to cache clearing
    } catch (err) {
      console.error("Failed to approve event:", err);
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    const reason = prompt("Please enter rejection reason:");
    if (reason) {
      try {
        await rejectEvent(eventId, reason);
      } catch (err) {
        console.error("Failed to reject event:", err);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
      } catch (err) {
        console.error("Failed to delete event:", err);
      }
    }
  };

  // Calculate card statistics
  const eventCards: CardData[] = useMemo(
    () => [
      {
        title: "Total Events",
        value: events.length.toString(),
        change: {
          trend: "up",
          value: "23%",
          description: "from last month",
        },
      },
      {
        title: "Active Events",
        value: transformedEvents
          .filter((event) => event.status === "active")
          .length.toString(),
        change: {
          trend: "up",
          value: "12%",
          description: "currently running",
        },
      },
      {
        title: "Pending Approval",
        value: transformedEvents
          .filter((event) => event.status === "pending")
          .length.toString(),
        change: {
          description: "Awaiting Review",
        },
      },
      {
        title: "Suspended",
        value: transformedEvents
          .filter((event) => event.status === "suspended")
          .length.toString(),
        change: {
          description: "Events suspended",
        },
      },
      {
        title: "Past Events",
        value: transformedEvents
          .filter((event) => event.status === "completed")
          .length.toString(),
        change: {
          trend: "up",
          value: "8%",
          description: "from last month",
        },
      },
    ],
    [events, transformedEvents]
  );

  const getInitials = (name: string): string => {
    if (!name || typeof name !== "string") {
      return "EV";
    }
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const eventFields: TableField<UIEvent>[] = [
    {
      key: "name",
      header: "Event name",
      enableHiding: false,
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={row.image} alt={row.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.business}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "business",
      header: "Business",
      cell: (_, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.business}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      cell: (_, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.date}</span>
          <span className="text-xs text-muted-foreground">{row.time}</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (_, row) => <span className="font-medium">{row.location}</span>,
    },
    {
      key: "ticketPrice",
      header: "Ticket Price",
      cell: (value) => (
        <div className="text-center">
          <span className="font-medium">${value as number}</span>
        </div>
      ),
      align: "center",
    },
    {
      key: "maxAttendees",
      header: "Capacity",
      cell: (value) => (
        <div className="text-center">
          <span className="font-medium">{value as number}</span>
        </div>
      ),
      align: "center",
    },
    {
      key: "status",
      header: "Status ↓",
      cell: (value, row) => {
        const statusConfig = {
          active: {
            label: "Active",
            dotColor: "bg-green-500",
          },
          pending: {
            label: "Pending",
            dotColor: "bg-yellow-500",
          },
          suspended: {
            label: "Suspended",
            dotColor: "bg-red-500",
          },
          completed: {
            label: "Completed",
            dotColor: "bg-blue-500",
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-gray-500",
          },
        };

        const config =
          statusConfig[value as EventStatus] || statusConfig.active;

        // Add action buttons for pending events
        const isPending = value === "pending";

        return (
          <div className="flex flex-col items-center gap-2">
            <Badge
              variant="secondary"
              className="flex flex-row items-center w-26 gap-2 bg-muted/50"
            >
              <div className={`size-2 rounded-full ${config.dotColor}`} />
              {config.label}
            </Badge>
            {isPending && (
              <div className="flex gap-1 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveEvent(row.id);
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectEvent(row.id);
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        );
      },
      align: "center",
      enableSorting: true,
    },
  ];

  const eventActions: TableAction<UIEvent>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (event) => {
        console.log("View event details:", event);
        navigate(`/admin/events/${event.id}`);
      },
    },
    {
      type: "delete",
      label: "Delete Event",
      onClick: (event) => {
        handleDeleteEvent(event.id);
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={eventCards} layout="1x5" />

          <div className="space-y-6">
            {/* Events Section */}
            <div className="rounded-lg border bg-card py-6 mb-6">
              {/* Header with refresh button */}
              <div className="flex justify-between items-center px-6 mb-4">
                <h2 className="text-2xl font-bold">Event Management</h2>
                <Button
                  onClick={handleRefresh}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? "Refreshing..." : "Refresh Events"}
                </Button>
              </div>

              {/* Tabs for filtering events by status */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as EventTab)}
                className="px-6 w-full bg-transparent rounded-none"
              >
                <TabsList className="grid w-full max-w-full grid-cols-5 rounded-none p-0 bg-transparent border-b">
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="all"
                  >
                    All Events
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="active"
                  >
                    Active Events
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="pending"
                  >
                    Pending Approvals
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="suspended"
                  >
                    Suspended
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="past"
                  >
                    Past Events
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0"></TabsContent>
                <TabsContent value="active" className="mt-0"></TabsContent>
                <TabsContent value="pending" className="mt-0"></TabsContent>
                <TabsContent value="suspended" className="mt-0"></TabsContent>
                <TabsContent value="past" className="mt-0"></TabsContent>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
                <div className="w-full">
                  <Search
                    placeholder="Search events, businesses, locations..."
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-full"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-12"
                        disabled={loading}
                      >
                        <FilterIcon className="w-4 h-4" />
                        All Status
                        {selectedStatuses.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedStatuses.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {statusOptions.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status.value}
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={() =>
                            handleStatusFilterChange(status.value)
                          }
                        >
                          {status.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Clear Filters Button */}
                  {(selectedStatuses.length > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      onClick={clearAllFilters}
                      className="text-sm"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Results Count */}
              <div className="px-6 mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredEvents.length} of {events.length} events
                  {(selectedStatuses.length > 0 || searchQuery) &&
                    " (filtered)"}
                  {loading && " - Loading..."}
                </p>
              </div>

              <DataTable<UIEvent>
                data={filteredEvents}
                fields={eventFields}
                actions={eventActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
                loading={loading}
                onRowClick={(event) => {
                  console.log("Event clicked:", event);
                  navigate(`/admin/events/${event.id}`);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
