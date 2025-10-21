import { ImageUploadField } from "@/components/image-upload-field";
import { RejectEventDialog } from "@/components/reject-event-dialog";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VibeCoreChart } from "@/components/vibe-core-chart";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Ticket,
  Banknote,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventRejectionNotice } from "@/components/event-rejection-notice";
import { Image } from "@/components/ui/image";
import { useReduxEvents } from "@/hooks/useReduxEvents";
import type { EventTicketType, ActivityLog, CheckIn, LiveGalleryImage } from "@/types/event";

export function BusinessViewEventPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    fetchEventById, 
    rejectEvent, 
    currentEvent,
  } = useReduxEvents({ mode: "business" });
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Fetch event when component mounts or id changes
  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, [id, fetchEventById]);



  if (!currentEvent) {
    return (
      <div className="min-h-screen">
        <SiteHeader label="Event Management" />
        <main className="flex-1 p-6">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-background dark:bg-card"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Event Not Found</h1>
          </div>
        </main>
      </div>
    );
  }

  const event = currentEvent;

  const handleRejectEvent = (reason: string) => {
    if (id) {
      rejectEvent(id, reason);
    }
    setRejectDialogOpen(false);
  };

  const handleBackgroundImageChange = (url: string | null) => {
    // Handle background image upload URL
    console.log("Background image uploaded:", url);
    // Here you would typically update your event data with the new image URL
    // For example: updateEventMedia(event.id, url);
  };

  const handleEditEvent = () => {
    navigate(`/business/events/${event.id}/edit`);
  };

  const handleResubmitEvent = () => {
    if (id) {
      // For resubmission, we need to update status to PENDING
      // You might need to add an updateEventStatus method to your hook
      // For now, using approveEvent as a placeholder - you should implement this properly
      console.log("Resubmitting event:", id);
      // This would need proper implementation in your hook
    }
    navigate("/business/events");
  };

  // Helper functions to format data for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getDisplayPrice = () => {
    if (!event.isPaid) return "Free";
    if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
      const lowestPrice = Math.min(
        ...event.eventTicketTypes.map((ticket: EventTicketType) => ticket.price)
      );
      return `UGX ${lowestPrice.toLocaleString()}`;
    }
    return "Paid";
  };

  const getDisplayAttendance = () => {
    if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
      const totalSold = event.eventTicketTypes.reduce(
        (sum: number, ticket: EventTicketType) => sum + ticket.soldCount,
        0
      );
      return `${totalSold}/${event.maxAttendees}`;
    }
    return `0/${event.maxAttendees}`;
  };

  const getDisplayRevenue = () => {
    if (event.eventTicketTypes && event.eventTicketTypes.length > 0) {
      const totalRevenue = event.eventTicketTypes.reduce(
        (sum: number, ticket: EventTicketType) => sum + ticket.price * ticket.soldCount,
        0
      );
      return `UGX ${totalRevenue.toLocaleString()}`;
    }
    return "UGX 0";
  };

  const gridClasses =
    event.status === "COMPLETED"
      ? "grid grid-cols-1 lg:grid-cols-3 gap-8"
      : "grid grid-cols-1 lg:grid-cols-1 gap-8";

  return (
    <div className="min-h-screen">
      <SiteHeader label="Event Management" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                className="p-2 bg-background dark:bg-card"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Back to Events</h1>
              </div>
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className={gridClasses}>
            {/* Left Column - Event Details */}
            <div
              className={
                event.status === "COMPLETED"
                  ? "lg:col-span-2 space-y-8"
                  : "space-y-8"
              }
            >
              {/* Event Header */}
              <Card className="pt-0">
                <div className="relative">
                  <img
                    src={event.coverImageUrl || event.backgroundImageUrl || "/placeholder-event.jpg"}
                    alt="Event Banner"
                    className="w-full h-84 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      variant={"default"}
                      className={
                        !event.isPaid
                          ? "text-green-800 bg-green-100"
                          : "text-blue-800 bg-blue-100"
                      }
                    >
                      {getDisplayPrice()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start justify-between mb-4 px-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{event.name}</h2>
                      <Badge
                        variant={"secondary"}
                        className={
                          event.status === "PENDING"
                            ? "text-orange-600 bg-orange-100"
                            : event.status === "APPROVED"
                            ? "text-green-600 bg-green-100"
                            : event.status === "REJECTED"
                            ? "text-red-600 bg-red-100"
                            : event.status === "COMPLETED"
                            ? "text-blue-600 bg-blue-100"
                            : "text-gray-600 bg-gray-100"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 px-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {formatDate(event.startDateTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Ticket className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ticket Price</p>
                        <p className="font-medium">{getDisplayPrice()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">
                          {formatTime(event.startDateTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="font-medium">
                          {getDisplayAttendance()} people
                        </p>
                      </div>
                    </div>
                    {event.isPaid && (
                      <div className="flex items-center gap-3">
                        <Banknote className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="font-medium">{getDisplayRevenue()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Rejection Reason and Quick Action - Only for Rejected events */}
              {event.status === "REJECTED" && event.rejectionReason && (
                <EventRejectionNotice
                  rejectionDate={event.rejectionDate || ""}
                  rejectionReason={event.rejectionReason}
                  onEditEvent={handleEditEvent}
                  onResubmit={handleResubmitEvent}
                />
              )}

              {/* Live content upload - Only for Completed events */}
              {event.status === "COMPLETED" && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold">Live Content Upload</h3>
                  <ImageUploadField
                    label="Photos and Videos as your event unfolds"
                    recommendedSize="1920×1080px"
                    formats="JPEG or PNG"
                    maxSize={10}
                    onImageUpload={handleBackgroundImageChange}
                  />
                </Card>
              )}

              {/* Event Gallery - Only for Completed events */}
              {event.status === "COMPLETED" && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold">Event Gallery</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {event.liveGallery?.map((image: LiveGalleryImage, index: number) => (
                      <div key={image.url || index} className="aspect-square">
                        <Image
                          src={image.url}
                          alt={`Live event gallery image ${index + 1}`}
                          size="full"
                          aspectRatio="1:1"
                          fit="cover"
                          radius="md"
                          className="hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onLoad={() =>
                            console.log(`Image ${index + 1} loaded`)
                          }
                          onError={() =>
                            console.warn(`Failed to load image ${index + 1}`)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar - Only for Completed events */}
            {event.status === "COMPLETED" && (
              <div className="space-y-6">
                {/* Vibe Core */}
                {event.vibeData && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Vibe Trend</h3>
                    <VibeCoreChart data={event.vibeData} className="h-32" />
                  </Card>
                )}

                {/* Live Check-ins */}
                {event.checkIns && event.checkIns.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Live Check-ins
                    </h3>
                    {event.checkIns.map((checkIn: CheckIn, index: number) => (
                      <div
                        key={index}
                        className="flex flex-row items-center justify-between py-1 last:border-b-0"
                      >
                        <span className="font-semibold">{checkIn.name}</span>
                        <p className="text-[#737373] text-sm">{checkIn.time}</p>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Activity Log - Always visible except for Completed events */}
          {event.status !== "COMPLETED" && event.activityLog && event.activityLog.length > 0 && (
            <div className="mt-8 w-full">
              <Card className="p-6 w-full">
                <div>
                  <h3 className="text-lg mb-2 font-semibold">Activity Log</h3>
                  <p className="text-sm">
                    Recent activities and changes for this event
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  {event.activityLog.map((activity: ActivityLog, index: number) => (
                    <Card key={index} className="p-4">
                      <div>
                        <p className="text-md font-medium mb-2">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <RejectEventDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        eventName={event.name}
        onReject={handleRejectEvent}
      />
    </div>
  );
}