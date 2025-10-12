import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Trophy,
  Calendar,
  Users,
  EllipsisVertical,
  ThumbsUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Contestant {
  id: string;
  name: string;
  votes: number;
  rank: number;
  imageUrl?: string;
}

interface HotOrNotEvent {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "upcoming";
  contestants: Contestant[];
  totalVotes: number;
  endsAt: string;
  categories: string[];
  imageUrl?: string;
}

interface HotOrNotCardsProps {
  events: HotOrNotEvent[];
  layout?: "grid" | "list";
  onLayoutChange?: (layout: "grid" | "list") => void;
  onViewLeaderboard?: (event: HotOrNotEvent) => void;
  className?: string;
}

// Disable Dialog Component
interface DisableDialogProps {
  openDisable: boolean;
  onOpenDisableChange: (open: boolean) => void;
  event: HotOrNotEvent | null;
  onDisable: (eventId: string) => void;
}


const DisableDialog: React.FC<DisableDialogProps> = ({
  openDisable,
  onOpenDisableChange,
  event,
  onDisable,
}) => {
  const handleDisable = () => {
    if (event) {
      onDisable(event.id);
      onOpenDisableChange(false);
    }
  };

  return (
    <Dialog open={openDisable} onOpenChange={onOpenDisableChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-left">
                Disable Category ?
              </DialogTitle>
              <DialogDescription className="text-md text-left mt-1">
                This action can be reversed later
              </DialogDescription>
            </div>
            <Button
              variant={"ghost"}
              onClick={() => onOpenDisableChange(false)}
            >
              <X />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-md text-muted-foreground">
            When the{" "}
            <span className="font-semibold text-foreground">
              {event?.title}
            </span>{" "}
            category is disabled, it will be hidden and inaccessible to users on
            the mobile app.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-5">
          <Button
            type="button"
            onClick={handleDisable}
            className="w-full flex-1 h-11 bg-[#D81A48] hover:bg-[#D81A48]/80 text-white"
          >
            Disable
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenDisableChange(false)}
            className="w-full flex-1 h-11"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const HotOrNotCards: React.FC<HotOrNotCardsProps> = ({
  events = [],
  layout = "grid",
  onLayoutChange,
  onViewLeaderboard,
  className,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [disableDialogOpen, setDisableDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] =
    React.useState<HotOrNotEvent | null>(null);
  const itemsPerPage = 6;

  // Pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = events.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [events.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDisableEvent = (eventId: string) => {
    // Here you would typically make an API call to disable the event
    console.log(`Disabling event with ID: ${eventId}`);
    // You can add your actual disable logic here
  };

  const openDisableDialog = (event: HotOrNotEvent) => {
    setSelectedEvent(event);
    setDisableDialogOpen(true);
  };


  if (events.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hot or Not Events</h3>
          <p className="text-muted-foreground">
            No voting events available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Layout Toggle */}
        <div className="flex rounded-md p-1 gap-2">
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

      {/* Events Grid/List */}
      <div
        className={cn(
          "gap-6",
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col space-y-6"
        )}
      >
        {paginatedEvents.map((event) => (
          <HotOrNotCard
            key={event.id}
            event={event}
            layout={layout}
            onViewLeaderboard={onViewLeaderboard}
            onOpenDisableDialog={openDisableDialog}
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

      {/* Disable Dialog */}
      <DisableDialog
        openDisable={disableDialogOpen}
        onOpenDisableChange={setDisableDialogOpen}
        event={selectedEvent}
        onDisable={handleDisableEvent}
      />

    </div>
  );
};

// Individual Hot or Not Card Component
interface HotOrNotCardProps {
  event: HotOrNotEvent;
  layout: "grid" | "list";
  onViewLeaderboard?: (event: HotOrNotEvent) => void;
  onOpenDisableDialog?: (event: HotOrNotEvent) => void;
}

const HotOrNotCard: React.FC<HotOrNotCardProps> = ({
  event,
  layout,
  onViewLeaderboard,
  onOpenDisableDialog,
}) => {
  const isGrid = layout === "grid";

  const getStatusConfig = (status: string) => {
    const config = {
      active: {
        label: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      completed: {
        label: "Completed",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      upcoming: {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
    };
    return config[status as keyof typeof config] || config.active;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "border border-input bg-card rounded-lg overflow-hidden transition-all hover:shadow-md",
        isGrid ? "flex flex-col" : "flex flex-row"
      )}
    >
      {/* Event Image */}
      <div
        className={cn(
          "bg-gradient-to-br from-purple-500 to-blue-600 relative",
          isGrid ? "h-68" : "w-68 flex-shrink-0"
        )}
      >
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className={cn(
              "w-full h-full object-cover",
              isGrid ? "" : "w-full h-full object-cover"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <Trophy className="h-8 w-8 opacity-90" />
          </div>
        )}

        {/* Status Badge */}
        <Badge
          className={cn(
            "absolute top-2 right-2 px-2 py-1 text-xs font-medium border rounded-full",
            getStatusConfig(event.status).color
          )}
        >
          {getStatusConfig(event.status).label}
        </Badge>

        {/* Dropdown Menu for Grid Layout - Only in image area */}
        {isGrid && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Category</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenDisableDialog?.(event)}>
                Disable Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Event Content */}
      <div className={cn("flex-1 p-4 flex flex-col", isGrid ? "" : "min-w-0")}>
        <div className="flex-1">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-lg text-[#5014D0] leading-tight flex-1">
                {event.title}
              </h3>

              {/* Dropdown Menu for List Layout - In header area */}
              {!isGrid && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Category</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenDisableDialog?.(event)}>
                Disable Category
              </DropdownMenuItem>
            </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>

          {/* Stats */}
          <div
            className={cn(
              "space-y-2 text-sm",
              isGrid ? "" : "flex items-center gap-6"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <span
                  className={cn("text-muted-foreground", isGrid ? "" : "mr-8")}
                >
                  Contestants
                </span>
              </div>
              <span className="font-semibold">{event.contestants.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <span
                  className={cn("text-muted-foreground", isGrid ? "" : "mr-8")}
                >
                  Total Votes
                </span>
              </div>
              <span className="font-semibold">
                {event.totalVotes.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <span
                  className={cn("text-muted-foreground", isGrid ? "" : "mr-8")}
                >
                  Ends
                </span>
              </div>
              <span className="font-semibold">{formatDate(event.endsAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t">
          <Button
            onClick={() => onViewLeaderboard?.(event)}
            variant="outline"
            className="w-full bg-transparent border-[#5041D0] text-[#5041D0] hover:bg-[#5041D0] hover:text-white"
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export { HotOrNotCards };
export type { HotOrNotEvent };
