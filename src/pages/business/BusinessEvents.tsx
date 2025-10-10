import { EventCards, type Event } from "@/components/event-cards";
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
import { FilterIcon, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import Event1 from "@/assets/images/event1.png";
import Event2 from "@/assets/images/event2.png";
import Event3 from "@/assets/images/event3.png";
import { DeleteEventDialog } from "@/components/delete-event-dialog";
import { useNavigate } from "react-router-dom";

type EventStatus = "Pending" | "Approved" | "Rejected";

export function BusinessEventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Mock events data based on your provided examples
  const [eventsData, setEventsData] = useState<Event[]>([
    {
      id: "1",
      title: "Saturday Night Fever",
      description:
        "Exclusive VIP experience with premium cocktails and live entertainment.",
      date: "Oct 25, 2025",
      time: "20:00",
      location: "Kololo, Kampala",
      attendees: "120/150",
      price: "Free",
      status: "Pending",
      category: "VIP",
      imageUrl: Event1,
    },
    {
      id: "2",
      title: "Acoustic Night",
      description:
        "Intimate acoustic session with local artists and craft cocktails.",
      date: "Oct 25, 2025",
      time: "20:00",
      location: "Kololo, Kampala",
      attendees: "120/150",
      price: "Paid",
      status: "Approved",
      category: "Music",
      imageUrl: Event2,
    },
    {
      id: "3",
      title: "VIP Lounge Experience",
      description:
        "Exclusive VIP experience with premium cocktails and live entertainment.",
      date: "Oct 29, 2025",
      time: "22:00",
      location: "Kololo, Kampala",
      attendees: "90/150",
      price: "Paid",
      status: "Approved",
      category: "VIP",
      imageUrl: Event3,
    },
    {
      id: "4",
      title: "Wine & Rhymes Night",
      description:
        "An evening of poetry and fine wines in a sophisticated setting.",
      date: "Nov 2, 2025",
      time: "19:00",
      location: "Najjera, Kampala",
      attendees: "75/100",
      price: "Paid",
      status: "Approved",
      category: "Cultural",
      imageUrl: Event2,
    },
    {
      id: "5",
      title: "Amapiano Kasiki",
      description: "Dance the night away with the hottest Amapiano beats.",
      date: "Nov 5, 2025",
      time: "21:00",
      location: "Kabalagala, Kampala",
      attendees: "200/250",
      price: "Paid",
      status: "Pending",
      category: "Music",
      imageUrl: Event3,
    },
    {
      id: "6",
      title: "Rooftop Sundowner",
      description: "Sunset drinks with panoramic city views and chill vibes.",
      date: "Sep 15, 2025",
      time: "17:00",
      location: "City Center, Kampala",
      attendees: "50/80",
      price: "Free",
      status: "Rejected",
      category: "Social",
    },
  ]);

  // Available status options for filter
  const statusOptions: { value: EventStatus; label: string }[] = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  // Get unique categories from events
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(eventsData.map((event) => event.category))];
    return categories.map((category) => ({
      value: category,
      label: category,
    }));
  }, [eventsData]);

  // Filter events based on active tab, search query, and selected filters
  const filteredEvents = useMemo(() => {
    let filtered = eventsData;

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((event) =>
        selectedStatuses.includes(event.status)
      );
    }

    // Apply category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.includes(event.category)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [eventsData, selectedStatuses, selectedCategories, searchQuery]);

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

  // Event statistics cards data
  const eventCards: CardData[] = [
    {
      title: "Total Events",
      value: eventsData.length.toString(),
      change: {
        value: "0%",
        description: "from last month",
      },
    },
    {
      title: "Total Check Ins",
      value: "0",
      change: {
        description: "Across all events",
      },
    },
    {
      title: "Total Reservations",
      value: "0%",
      change: {
        value: "0%",
        description: "Vibe Core Rate",
      },
    },
    {
      title: "Total Revenue",
      value: "$0",
      change: {
        description: "From paid events",
      },
    },
  ];

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (eventId: string) => {
    // Remove the event from the eventsData
    setEventsData((prev) => prev.filter((event) => event.id !== eventId));
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleEditEvent = (event: Event) => {
    // Navigate to edit page or open edit modal
    console.log("Edit event:", event.id);
    navigate("/business/events/edit-event");
    // router.push(`/events/edit/${event.id}`);
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

                  {/* Clear Filters Button */}
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
