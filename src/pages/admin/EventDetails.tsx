import { RejectEventDialog } from "@/components/reject-event-dialog";
import { ReportedCases } from "@/components/reported-cases";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VibeCoreChart } from "@/components/vibe-core-chart";
import {
  ArrowLeft,
  CheckCircle,
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  User2,
  Mail,
  Phone,
  Ticket,
  Banknote,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useReduxEvents } from "@/hooks/useReduxEvents";

export function EventDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const {
    events,
    currentEvent,
    loading,
    fetchEventById,
    approveEvent,
    rejectEvent,
  } = useReduxEvents();

  const event = currentEvent || events.find((event) => event.id === id);

  useEffect(() => {
    if (id && !event) {
      fetchEventById(id);
    }
  }, [id, event, fetchEventById]);

  const highVibeData = [
    { time: "10pm", vibe: 85 },
    { time: "11pm", vibe: 92 },
    { time: "12am", vibe: 78 },
    { time: "1am", vibe: 88 },
    { time: "2am", vibe: 95 },
    { time: "3am", vibe: 82 },
    { time: "4am", vibe: 90 },
  ];

  const handleApproveEvent = async () => {
    if (!id) return;

    try {
      await approveEvent(id);
      toast.success("Event Approved", {
        description: "The event has been approved successfully!",
      });
    } catch (error) {
      toast.error("Failed to approve event", {
        description: "Please try again later.",
      });
    }
  };

  const handleRejectEvent = async (reason: string) => {
    if (!id) return;

    try {
      await rejectEvent(id, reason);
      setRejectDialogOpen(false);
      toast.success("Event Rejected", {
        description: "The event has been rejected successfully!",
      });
    } catch (error) {
      toast.error("Failed to reject event", {
        description: "Please try again later.",
      });
    }
  };

  const getInitials = (name: string): string => {
    if (!name || typeof name !== "string") return "EV";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
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

  // Check if event is in the past
  const isEventCompleted = (event: any): boolean => {
    const eventEnd = new Date(event.endDateTime);
    const now = new Date();
    return eventEnd < now;
  };

  // Get the display status (considers both backend status and date)
  const getDisplayStatus = (event: any): string => {
    if (event.status === "APPROVED" && isEventCompleted(event)) {
      return "COMPLETED";
    }
    return event.status; // PENDING, APPROVED, REJECTED, CANCELLED
  };

  const getStatusBadge = (event: any) => {
    const displayStatus = getDisplayStatus(event);

    const statusConfig = {
      PENDING: {
        label: "Pending",
        variant: "secondary",
        className: "text-orange-600 bg-orange-600/20",
      },
      APPROVED: {
        label: "Active",
        variant: "default",
        className: "text-green-800 bg-green-800/20",
      },
      COMPLETED: {
        label: "Completed",
        variant: "default",
        className: "text-blue-600 bg-blue-600/20",
      },
      REJECTED: {
        label: "Rejected",
        variant: "destructive",
        className: "text-red-600 bg-red-600/20",
      },
      CANCELLED: {
        label: "Cancelled",
        variant: "destructive",
        className: "text-gray-600 bg-gray-600/20",
      },
    };

    const config =
      statusConfig[displayStatus as keyof typeof statusConfig] ||
      statusConfig.PENDING;

    return (
      <Badge variant={config.variant as any} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (ticketPrice: number) => {
    return ticketPrice > 0 ? (
      <Badge variant="default" className="text-green-800 bg-white">
        Paid
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-blue-600 bg-white">
        Free
      </Badge>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="flex-1 p-6">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="secondary"
              size="icon"
              className="p-2 bg-background dark:bg-card"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Loading Event...</h1>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading event details...</div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state if no event found
  if (!event) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="flex-1 p-6">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="secondary"
              size="sm"
              className="p-2 bg-background dark:bg-card"
              onClick={() => navigate("/admin/events")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Event Not Found</h1>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">
              Event not found or has been deleted.
            </div>
          </div>
        </main>
      </div>
    );
  }

  const businessAccount = event.venue.businessAccount;
  const baseUser = businessAccount.baseUser;
  const firstImage = event.eventmedia?.find((media) => media.type === "IMAGE");
  const bannerImage =
    firstImage?.url ||
    event.backgroundImageUrl ||
    event.coverImageUrl ||
    "/Event-Demo-Bg.png";

  const isPending = event.status === "PENDING";

  return (
    <div className="min-h-screen">
      <SiteHeader label="Event Details" />
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
                <h1 className="text-xl font-semibold">Event Management</h1>
              </div>
            </div>
            <div className="flex gap-4">
              {isPending && (
                <>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="p-2 h-10 bg-[#5014D0] hover:bg-[#5014D0]/70 text-white"
                    onClick={handleApproveEvent}
                  >
                    <CheckCircle className="h-4 w-4 mr-0" />
                    Approve Event
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="p-2 h-10 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setRejectDialogOpen(true)}
                  >
                    <X className="h-4 w-4 mr-0" />
                    Reject Event
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Header */}
              <Card className="pt-0">
                <div className="relative">
                  <img
                    src={bannerImage}
                    alt="Event Banner"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-4 left-4">
                    {getPaymentBadge(event.ticketPrice)}
                  </div>
                </div>
                <div className="flex items-start justify-between mb-4 px-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{event.name}</h2>
                      {getStatusBadge(event)}
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
                        <p className="font-medium">{event.venue.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Ticket className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ticket Price</p>
                        <p className="font-medium">$ {event.ticketPrice}</p>
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
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">
                          {event.maxAttendees} people
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Banknote className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Estimated Revenue
                        </p>
                        <p className="font-medium">
                          $
                          {(
                            event.ticketPrice * event.maxAttendees
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Business Info */}
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={""} alt={businessAccount.companyName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(businessAccount.companyName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {businessAccount.companyName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {businessAccount.businessType}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-4">
                    <User2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {baseUser.firstName} {baseUser.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{baseUser.email}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{businessAccount.phone}</span>
                  </div>
                </div>
              </Card>

              {/* Vibe Core */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vibe Core</h3>
                <VibeCoreChart data={highVibeData} className="h-32" />
              </Card>
            </div>
          </div>

          {/* Bottom Section with Tabs */}
          <div className="mt-8 w-full">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent mb-4">
                <TabsTrigger
                  value="activity"
                  className="h-10 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-600"
                >
                  Recent Logs
                </TabsTrigger>
                <TabsTrigger
                  value="reported"
                  className="h-10 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-600"
                >
                  Reported Cases
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4">
                <Card className="p-6 w-full">
                  <div>
                    <h3 className="text-lg mb-2 font-semibold">Activity Log</h3>
                    <p className="text-sm">
                      Recent activities and changes for this event
                    </p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Card>
                      <div className="pl-4 py-3">
                        <p className="text-md font-medium mb-2">
                          Event created
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(event.createdAt)} at{" "}
                          {formatTime(event.createdAt)}
                        </p>
                      </div>
                    </Card>
                    {event.approvedAt && (
                      <Card>
                        <div className="pl-4 py-3">
                          <p className="text-md font-medium mb-2">
                            Event approved
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(event.approvedAt)} at{" "}
                            {formatTime(event.approvedAt)}
                          </p>
                        </div>
                      </Card>
                    )}
                    <Card>
                      <div className="pl-4 py-3">
                        <p className="text-md font-medium mb-2">Last updated</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(event.updatedAt)} at{" "}
                          {formatTime(event.updatedAt)}
                        </p>
                      </div>
                    </Card>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reported" className="mt-4">
                <Card className="p-6 w-full">
                  <ReportedCases
                    cases={[
                      {
                        id: "1",
                        title: "Noise Complaint",
                        status: "OPEN",
                        description:
                          "Excessive noise levels reported by multiple neighbours. Sound exceeding city ordinance limits.",
                        event: event.name,
                        reporter: "@guest_alex99",
                        reportedDate: "28-09-2025",
                        reportedTime: "23:45",
                      },
                      {
                        id: "2",
                        title: "Underage Drinking",
                        status: "INVESTIGATING",
                        description:
                          "Minor attempted to purchase alcohol with fake ID. ID confiscated and authorities notified.",
                        event: event.name,
                        reporter: "@bartender_mike",
                        reportedDate: "28-09-2025",
                        reportedTime: "23:45",
                      },
                    ]}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
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
