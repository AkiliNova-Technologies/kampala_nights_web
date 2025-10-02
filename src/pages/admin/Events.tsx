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
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type EventStatus =
  | "active"
  | "pending"
  | "suspended"
  | "completed"
  | "cancelled";
type EventTab = "all" | "active" | "pending" | "suspended" | "past";

interface Event {
  id: number;
  name: string;
  business: string;
  businessImage?: string;
  date: string;
  time: string;
  location: string;
  vibeScore: number;
  status: EventStatus;
  image?: string;
  [key: string]: unknown;
}

export function EventsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EventTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>([]);

  const [eventData] = useState<Event[]>([
    {
      id: 1,
      name: "Friday Night Live",
      business: "Nightlife Central",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 15, 2025",
      time: "9:00 PM",
      location: "Kololo",
      vibeScore: 92,
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "DJ Spin Master",
      business: "Illusion",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 16, 2025",
      time: "10:00 PM",
      location: "Nakasero",
      vibeScore: 88,
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Karaoke Night",
      business: "Cat Walk",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 14, 2025",
      time: "8:00 PM",
      location: "Kabalagala",
      vibeScore: 85,
      status: "pending",
    },
    {
      id: 4,
      name: "VIP Lounge Party",
      business: "Sky Club Kampala",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 10, 2025",
      time: "11:00 PM",
      location: "Industrial Area",
      vibeScore: 95,
      status: "completed",
      image: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "Summer Festival",
      business: "Elite Events Co",
      businessImage: "/api/placeholder/40/40",
      date: "Aug 30, 2025",
      time: "7:00 PM",
      location: "Bugolobi",
      vibeScore: 78,
      status: "completed",
    },
    {
      id: 6,
      name: "Jazz Night",
      business: "Sky Lounge Kololo",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 20, 2025",
      time: "8:30 PM",
      location: "Kololo Heights",
      vibeScore: 90,
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 7,
      name: "Bass Revolution",
      business: "Bassline Bukoto",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 18, 2025",
      time: "10:30 PM",
      location: "Bukoto Street",
      vibeScore: 87,
      status: "pending",
    },
    {
      id: 8,
      name: "Velvet Experience",
      business: "Velvet Room Muyenga",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 12, 2025",
      time: "9:30 PM",
      location: "Muyenga Tank Hill",
      vibeScore: 82,
      status: "suspended",
      image: "/api/placeholder/40/40",
    },
    {
      id: 9,
      name: "Reggae Night",
      business: "Island Vibes",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 5, 2025",
      time: "8:00 PM",
      location: "Entebbe Road",
      vibeScore: 89,
      status: "completed",
    },
    {
      id: 10,
      name: "Electronic Dreams",
      business: "Neon Club",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 25, 2025",
      time: "11:00 PM",
      location: "City Center",
      vibeScore: 91,
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 11,
      name: "Wine Tasting",
      business: "Vintage Cellar",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 22, 2025",
      time: "6:00 PM",
      location: "Garden City",
      vibeScore: 84,
      status: "pending",
    },
    {
      id: 12,
      name: "Comedy Night",
      business: "Laugh Factory",
      businessImage: "/api/placeholder/40/40",
      date: "Sep 8, 2025",
      time: "7:30 PM",
      location: "Acacia Avenue",
      vibeScore: 79,
      status: "completed",
    },
  ]);

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
    let filtered = eventData;

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
          event.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [eventData, activeTab, selectedStatuses, searchQuery]);

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

  const eventCards: CardData[] = [
    {
      title: "Total Events",
      value: eventData.length.toString(),
      change: {
        trend: "up",
        value: "23%",
        description: "from last month",
      },
    },
    {
      title: "Active Events",
      value: eventData
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
      value: eventData
        .filter((event) => event.status === "pending")
        .length.toString(),
      change: {
        description: "Awaiting Review",
      },
    },
    {
      title: "Suspended",
      value: eventData
        .filter((event) => event.status === "suspended")
        .length.toString(),
      change: {
        description: "Events suspended",
      },
    },
    {
      title: "Past Events",
      value: eventData
        .filter((event) => event.status === "completed")
        .length.toString(),
      change: {
        trend: "up",
        value: "8%",
        description: "from last month",
      },
    },
  ];

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  //   const getVibeScoreColor = (score: number): string => {
  //     if (score >= 90) return "text-green-600 bg-green-50";
  //     if (score >= 80) return "text-blue-600 bg-blue-50";
  //     if (score >= 70) return "text-yellow-600 bg-yellow-50";
  //     return "text-red-600 bg-red-50";
  //   };

  const eventFields: TableField<Event>[] = [
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
      cell: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value as string}</span>
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
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "vibeScore",
      header: "Vibe Score",
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
      cell: (value) => {
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
          statusConfig[value as keyof typeof statusConfig] ||
          statusConfig.active;

        return (
          <Badge
            variant="secondary"
            className="flex flex-row items-center w-26 gap-2 bg-muted/50"
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center",
      enableSorting: true,
    },
  ];

  const eventActions: TableAction<Event>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (event) => {
        console.log("View event details:", event);
        // Navigate to event details page
        navigate("event-details");
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
                    className="rounded-md"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-12"
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
                  Showing {filteredEvents.length} of {eventData.length} events
                  {(selectedStatuses.length > 0 || searchQuery) &&
                    " (filtered)"}
                </p>
              </div>

              <DataTable<Event>
                data={filteredEvents}
                fields={eventFields}
                actions={eventActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
                onRowClick={(event) => {
                  console.log("Event clicked:", event);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
