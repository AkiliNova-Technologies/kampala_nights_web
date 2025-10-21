import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  Users,
  EllipsisVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import { Button } from "./ui/button";
import emptyStateImage from "@/assets/images/no-events.png";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface EventCardsProps {
  events: Event[];
  layout?: "grid" | "list";
  onLayoutChange?: (layout: "grid" | "list") => void;
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: string) => void;
  onCategoryFilter?: (category: string) => void;
  onEditEvent?: (event: Event) => void;
  onViewEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
  searchValue?: string;
  selectedStatus?: string;
  selectedCategory?: string;
  className?: string;
}

const EventCards: React.FC<EventCardsProps> = ({
  events = [],
  layout = "grid",
  onLayoutChange,
  onEditEvent,
  onViewEvent,
  onDeleteEvent,
  searchValue = "",
  selectedStatus = "all",
  selectedCategory = "all",
  className,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  // Pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = events.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [events.length, selectedStatus, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    if (onEditEvent) {
      onEditEvent(event);
    } else {
      // Default behavior - navigate to edit page
      console.log(`Navigating to edit page for event: ${event.id}`);
    }
  };

  // Handle view event
  const handleViewEvent = (event: Event) => {
    if (onViewEvent) {
      onViewEvent(event);
    } else {
      // Default behavior - navigate to view page
      console.log(`Navigating to view page for event: ${event.id}`);
    }
  };

  // Handle delete event
  const handleDeleteEvent = (event: Event) => {
    if (onDeleteEvent) {
      onDeleteEvent(event);
    }
  };

  // Fallback state when no events
  if (events.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={emptyStateImage} alt="No events fallback image" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
          <p className="text-muted-foreground">
            {searchValue ||
            selectedStatus !== "all" ||
            selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Filters and Layout Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Layout Toggle */}
          <div className="flex rounded-md p-1 gap-2 -mt-2">
            <Button
              variant="secondary"
              onClick={() => onLayoutChange?.("grid")}
              className={cn(
                "p-1.5 rounded-sm transition-colors flex-row",
                layout === "grid"
                  ? "bg-[#5041D0] text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="h-5 w-5" />
              Grid
            </Button>
            <Button
              variant="secondary"
              onClick={() => onLayoutChange?.("list")}
              className={cn(
                "p-1.5 rounded-sm transition-colors",
                layout === "list"
                  ? "bg-[#5041D0] text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      <div
        className={cn(
          "gap-4",
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col space-y-4"
        )}
      >
        {paginatedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            layout={layout}
            onEditEvent={handleEditEvent}
            onViewEvent={handleViewEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Individual Event Card Component
interface EventCardProps {
  event: Event;
  layout: "grid" | "list";
  onEditEvent?: (event: Event) => void;
  onViewEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  layout,
  onEditEvent,
  onViewEvent,
  onDeleteEvent,
}) => {
  const navigate = useNavigate();
  const isGrid = layout === "grid";

  // Helper functions to format data for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Get display price from eventTicketTypes
  const getDisplayPrice = (): string => {
    if (!event.isPaid) return "Free";
    if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
      const lowestPrice = Math.min(...event.eventTicketTypes.map(ticket => ticket.price));
      return `UGX ${lowestPrice.toLocaleString()}`;
    }
    return "Paid";
  };

  // Get display attendance from ticket sales
  const getDisplayAttendance = (): string => {
    if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
      const totalSold = event.eventTicketTypes.reduce((sum, ticket) => sum + ticket.soldCount, 0);
      return `${totalSold} attendees`;
    }
    return "0 attendees";
  };

  // Get image URL from event media
  const getImageUrl = (): string => {
    const firstImage = event.eventmedia?.find((media) => media.type === "IMAGE");
    return firstImage?.url || event.coverImageUrl || event.backgroundImageUrl || "";
  };

  // Handle view event click
  const handleViewEvent = () => {
    if (onViewEvent) {
      onViewEvent(event);
    } else {
      // Fallback navigation
      navigate(`/business/events/${event.id}`);
    }
  };

  // Handle card click for grid layout (entire card is clickable)
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger if the click wasn't on a button or dropdown
    if (!(e.target as HTMLElement).closest('button, [role="button"]')) {
      handleViewEvent();
    }
  };

  return (
    <div
      className={cn(
        "border border-input bg-card rounded-lg overflow-hidden transition-all hover:shadow-md relative cursor-pointer",
        isGrid ? "flex flex-col" : "flex flex-row"
      )}
      onClick={isGrid ? handleCardClick : undefined}
    >
      {/* Event Image */}
      <div
        className={cn(
          "bg-background relative",
          isGrid ? "h-58" : "w-78 flex-shrink-0"
        )}
      >
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={event.name}
            className={cn(
              "w-full h-full object-cover",
              isGrid ? "" : "w-full h-48 object-cover"
            )}
          />
        ) : (
          <div className="w-full h-full min-h-48 flex items-center justify-center text-primary">
            <Calendar className="h-12 w-12 opacity-80" />
          </div>
        )}
        <Badge
          className={cn(
            "inline-flex px-2 py-1 items-center text-xs font-medium absolute top-2 right-2",
            event.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : event.status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : event.status === "REJECTED"
              ? "bg-red-100 text-red-800"
              : event.status === "COMPLETED"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          )}
        >
          {event.status}
        </Badge>

        {isGrid ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"secondary"}
                className="bg-transparent hover:bg-[#5041D0]/70 absolute bottom-2 right-2 h-8 w-8"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking menu
              >
                <EllipsisVertical className="size-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleViewEvent}>
                View Event
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditEvent?.(event);
                }}
              >
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent?.(event);
                }}
                className="text-red-600 focus:text-red-600"
              >
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <></>
        )}
      </div>

      {/* Event Content */}
      <div
        className={cn(
          "flex-1 px-6 py-4",
          isGrid ? "" : "flex flex-col justify-between"
        )}
      >
        <div>
          {/* Header */}
          <div className="flex flex-row items-start justify-between mb-2">
            <h3 
              className="font-semibold text-lg text-[#5041D0] leading-tight pr-2 cursor-pointer hover:underline"
              onClick={!isGrid ? handleViewEvent : undefined}
            >
              {event.name}
            </h3>
            <div className="flex flex-row gap-5 items-center">
              <Badge
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0",
                  !event.isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                )}
              >
                {getDisplayPrice()}
              </Badge>
              {isGrid ? (
                <></>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className="bg-[#5041D0]/20 hover:bg-[#5041D0]/70 h-8 w-8"
                    >
                      <EllipsisVertical className="size-5 text-[#5041D0]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleViewEvent}>
                      View Event
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditEvent?.(event)}>
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteEvent?.(event)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {event.description}
          </p>

          {/* Details */}
          <div
            className={cn(
              "space-y-2",
              isGrid ? "" : "flex flex-row items-center",
              "text-sm gap-4"
            )}
          >
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {formatDate(event.startDateTime)} at {formatTime(event.startDateTime)}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{getDisplayAttendance()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EventCards };
export type { EventCardsProps };