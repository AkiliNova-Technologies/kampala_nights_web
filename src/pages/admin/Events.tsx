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

interface UIEvent {
  id: string;
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
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  isApproved: boolean;
  isActive: boolean;
  isPaid: boolean;
  allowReservations: boolean;
  createdAt: string;
  eventTicketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    soldCount: number;
    isActive: boolean;
    createdAt: string;
  }>;
  groupPricing: Array<{
    id: string;
    group1_3: number;
    group4_6: number;
    group7_10: number;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
  }>;
  // REMOVED: eventReservationPricing - No longer needed
  eventmedia: Array<{
    id: string;
    type: "IMAGE" | "VIDEO";
    position: number;
    url: string;
    storageKey: string;
    width?: number | null;
    height?: number | null;
    durationSec?: number | null;
  }>;

  // UI-specific computed fields
  business: string;
  businessImage?: string;
  date: string;
  time: string;
  displayLocation: string;
  vibeScore: number;
  image?: string;
  displayPrice: string;
  displayAttendance: string;
  displayRevenue: string;
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

  const { events, loading, fetchEvents, refreshEvents, hasData } =
    useReduxEvents({ mode: "admin" });

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
      case "COMPLETED":
        return "completed";
      default:
        return "completed";
    }
  };

  const transformedEvents: UIEvent[] = useMemo(() => {
    return events.map((event) => {
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

      // Calculate display values - Updated to handle both ticket and group pricing
      const getDisplayPrice = () => {
        if (event.isPaid) {
          // Paid events with tickets
          if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
            const lowestPrice = Math.min(
              ...event.eventTicketTypes.map((ticket) => ticket.price)
            );
            return `UGX ${lowestPrice.toLocaleString()}`;
          }
          return "Paid";
        } else {
          // Free events with group pricing
          if (event.groupPricing && event.groupPricing.length > 0) {
            const groupPricing = event.groupPricing[0];
            const lowestPrice = Math.min(
              groupPricing.group1_3,
              groupPricing.group4_6,
              groupPricing.group7_10
            );
            return lowestPrice > 0
              ? `From UGX ${lowestPrice.toLocaleString()}`
              : "Free";
          }
          return "Free";
        }
      };

      const getDisplayAttendance = () => {
        if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
          const totalSold = event.eventTicketTypes.reduce(
            (sum, ticket) => sum + ticket.soldCount,
            0
          );
          return `${totalSold}/${event.maxAttendees}`;
        }
        return `0/${event.maxAttendees}`;
      };

      const getDisplayRevenue = () => {
        if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
          const totalRevenue = event.eventTicketTypes.reduce(
            (sum, ticket) => sum + ticket.price * ticket.soldCount,
            0
          );
          return `UGX ${totalRevenue.toLocaleString()}`;
        }
        return "UGX 0";
      };

      return {
        ...event,
        // Ensure groupPricing is always an array (for consistency)
        groupPricing: event.groupPricing || [],

        // UI computed fields
        business: "Event Business",
        date,
        time,
        displayLocation: event.location,
        vibeScore: Math.floor(Math.random() * 30) + 70,
        image: imageUrl,
        businessImage: "/api/placeholder/40/40",
        displayPrice: getDisplayPrice(),
        displayAttendance: getDisplayAttendance(),
        displayRevenue: getDisplayRevenue(),
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
        filtered = filtered.filter(
          (event) =>
            mapEventStatus(event.status, event.endDateTime) === "active"
        );
        break;
      case "pending":
        filtered = filtered.filter(
          (event) =>
            mapEventStatus(event.status, event.endDateTime) === "pending"
        );
        break;
      case "suspended":
        filtered = filtered.filter(
          (event) =>
            mapEventStatus(event.status, event.endDateTime) === "suspended"
        );
        break;
      case "past":
        filtered = filtered.filter(
          (event) =>
            mapEventStatus(event.status, event.endDateTime) === "completed"
        );
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((event) =>
        selectedStatuses.includes(
          mapEventStatus(event.status, event.endDateTime)
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.business.toLowerCase().includes(query) ||
          event.displayLocation.toLowerCase().includes(query) ||
          event.eventType.toLowerCase().includes(query)
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
          .filter(
            (event) =>
              mapEventStatus(event.status, event.endDateTime) === "active"
          )
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
          .filter(
            (event) =>
              mapEventStatus(event.status, event.endDateTime) === "pending"
          )
          .length.toString(),
        change: {
          description: "Awaiting Review",
        },
      },
      {
        title: "Suspended",
        value: transformedEvents
          .filter(
            (event) =>
              mapEventStatus(event.status, event.endDateTime) === "suspended"
          )
          .length.toString(),
        change: {
          description: "Events suspended",
        },
      },
      {
        title: "Past Events",
        value: transformedEvents
          .filter(
            (event) =>
              mapEventStatus(event.status, event.endDateTime) === "completed"
          )
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
      key: "displayLocation",
      header: "Location",
      cell: (_, row) => (
        <div className="text-wrap max-w-2xs">
          <span className="font-medium line-clamp-2">
            {row.displayLocation}
          </span>
        </div>
      ),
    },
    {
      key: "displayPrice",
      header: "Ticket Price",
      cell: (value) => (
        <div className="text-center">
          <span className="font-medium">{value as string}</span>
        </div>
      ),
      align: "center",
    },
    {
      key: "displayPrice",
      header: "Ticket Price",
      cell: (value) => (
        <div className="text-center">
          <span className="font-medium">{value as string}</span>
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
      cell: (_, row) => {
        const uiStatus = mapEventStatus(row.status, row.endDateTime);
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

        const config = statusConfig[uiStatus] || statusConfig.active;

        return (
          <div className="flex flex-col items-center gap-2">
            <Badge
              variant="secondary"
              className="flex flex-row items-center w-26 gap-2 bg-muted/50"
            >
              <div className={`size-2 rounded-full ${config.dotColor}`} />
              {config.label}
            </Badge>
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
