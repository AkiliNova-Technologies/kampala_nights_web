import { EventCards } from "@/components/event-cards";
import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/search";
import { DollarSign, FilterIcon, HandCoins, Plus, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { DeleteEventDialog } from "@/components/delete-event-dialog";
import { useNavigate } from "react-router-dom";

import type { Event, EventStatus } from "@/types/event";
import { useReduxEvents } from "@/hooks/useReduxEvents";
// import { useEvents } from "@/hooks/useEvent";

export function BusinessEventsPage() {
  const navigate = useNavigate();
  const { events, deleteEvent } = useReduxEvents({ mode: "business" });
  // const { events, deleteEvent } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const statusOptions: { value: EventStatus; label: string }[] = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "COMPLETED", label: "Live" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(events.map((event) => event.eventType))];
    return categories.map((category) => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
    }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((event) =>
        selectedStatuses.includes(event.status)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.includes(event.eventType)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, selectedStatuses, selectedCategories, searchQuery]);

  const handleStatusFilterChange = (status: EventStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSearchQuery("");
  };

  // Calculate statistics from actual event data
  const eventCards: CardData[] = useMemo(() => {
    const totalEvents = events.length;

    // Calculate total attendees from ticket sales
    const totalAttendees = events.reduce((total, event) => {
      if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
        return (
          total +
          event.eventTicketTypes.reduce(
            (ticketTotal, ticket) => ticketTotal + ticket.soldCount,
            0
          )
        );
      }
      return total;
    }, 0);

    // Calculate average attendance rate
    const avgAttendance =
      events.length > 0
        ? Math.round(
            (totalAttendees /
              events.reduce((total, event) => total + event.maxAttendees, 0)) *
              100
          )
        : 0;

    // Calculate total revenue
    const totalRevenue = events.reduce((total, event) => {
      if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
        return (
          total +
          event.eventTicketTypes.reduce(
            (revenue, ticket) => revenue + ticket.price * ticket.soldCount,
            0
          )
        );
      }
      return total;
    }, 0);

    return [
      {
        title: "Total Events",
        value: totalEvents.toString(),
        change: {
          description: "from last month",
        },
        rightIcon: <HandCoins className="h-4 w-4 text-black" />,
        iconBgColor: "bg-[#D7FFC3]",
      },
      {
        title: "Total Attendees",
        value: totalAttendees.toLocaleString(),
        change: {
          description: "Across all events",
        },
        rightIcon: <Users className="h-4 w-4 text-black" />,
        iconBgColor: "bg-[#DECCFE]",
      },
      {
        title: "Avg. Attendance",
        value: `${avgAttendance}%`,
        change: {
          description: "Vibe Core Rate",
        },
        rightIcon: <Users className="h-4 w-4 text-black" />,
        iconBgColor: "bg-[#DECCFE]",
      },
      {
        title: "Total Revenue",
        value: `UGX ${totalRevenue.toLocaleString()}`,
        change: {
          description: "From paid events",
        },
        rightIcon: <DollarSign className="h-4 w-4 text-black" />,
        iconBgColor: "bg-[#C4E8D1]",
      },
    ];
  }, [events]);

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (eventId: string) => {
    deleteEvent(eventId);
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleEditEvent = (event: Event) => {
    navigate(`/business/events/${event.id}/edit`);
  };

  const handleViewEvent = (event: Event) => {
    navigate(`/business/events/${event.id}`);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        rightActions={
          <Button
            variant="secondary"
            className="bg-[#5041D0] hover:bg-[#5041D0]/90 text-white"
            onClick={() => navigate("/business/events/create-event")}
          >
            {" "}
            <Plus /> Create Event
          </Button>
        }
      />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          {/* Statistics Cards */}
          <SectionCards cards={eventCards} layout="1x4" />

          <div className="space-y-4">
            {/* Events Section */}
            <div className="rounded-lg border bg-card py-6 mb-3">
              {/* Search and Filter Section */}
              <div className="px-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1">
                  <Search
                    placeholder="Search your events"
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-full"
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-11"
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

                  {/* Category Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-11"
                      >
                        <FilterIcon className="w-4 h-4" />
                        All Categories
                        {selectedCategories.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedCategories.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {categoryOptions.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category.value}
                          checked={selectedCategories.includes(category.value)}
                          onCheckedChange={() =>
                            handleCategoryFilterChange(category.value)
                          }
                        >
                          {category.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {(selectedStatuses.length > 0 ||
                    selectedCategories.length > 0 ||
                    searchQuery) && (
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

              {/* Event Cards Component */}
              <div className="px-6 mt-6">
                <EventCards
                  events={filteredEvents}
                  layout={layout}
                  onLayoutChange={setLayout}
                  onSearch={setSearchQuery}
                  onEditEvent={handleEditEvent}
                  onViewEvent={handleViewEvent}
                  onDeleteEvent={handleDeleteClick}
                  onStatusFilter={(status) =>
                    setSelectedStatuses(
                      status === "all" ? [] : [status as EventStatus]
                    )
                  }
                  onCategoryFilter={(category) =>
                    setSelectedCategories(category === "all" ? [] : [category])
                  }
                  searchValue={searchQuery}
                  selectedStatus={
                    selectedStatuses.length === 0 ? "all" : selectedStatuses[0]
                  }
                  selectedCategory={
                    selectedCategories.length === 0
                      ? "all"
                      : selectedCategories[0]
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <DeleteEventDialog
        event={eventToDelete}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
