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
import { useNavigate } from "react-router-dom";

export function EventDetailsPage() {
  const navigate = useNavigate();

  const highVibeData = [
    { day: "Sun", vibe: 85 },
    { day: "Mon", vibe: 92 },
    { day: "Tue", vibe: 78 },
    { day: "Wed", vibe: 88 },
    { day: "Thu", vibe: 95 },
    { day: "Fri", vibe: 82 },
    { day: "Sat", vibe: 90 },
  ];

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <>
      <SiteHeader />

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Event Management</h1>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="p-2 h-10 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Event
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="p-2 h-10 bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Header */}
              <Card className="pt-0">
                <div className="relative">
                  <img
                    src="/Event-Demo-Bg.png"
                    alt="Event Banner"
                    className="w-full h-64 object-fill rounded-t-lg"
                  />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant={"default"} className="text-green-800">
                      Paid
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start justify-between mb-4 px-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">
                        Saturday Night Fever
                      </h2>
                      <Badge variant={"secondary"} className="text-orange-600">Pending</Badge>
                    </div>
                    <p className="text-gray-600 mt-2">
                      The ultimate nightclub experience with world-class DJs,
                      premium bottle service, and an unforgettable atmosphere.
                    </p>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 px-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">27, Oct, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">Kololo, Kampala</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Ticket className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ticket Price</p>
                        <p className="font-medium">$ 50</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">22:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="font-medium">450 / 500 people</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Banknote className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-medium">$12,500</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Nightclub Info */}
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={""} alt={"Nightlife Central"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials("Nightlife Central")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">Nightlife Central</h3>
                    <p className="text-sm text-gray-600">Nightclub</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <User2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Marcus Johnson</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">marcus@nightlifecentral.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">+1 (555) 123-4567</span>
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

                  <div className="space-y-2">
                    <Card>
                      <div className="pl-4 py-1">
                        <p className="text-md font-medium mb-2">
                          Event submitted for approval
                        </p>
                        <p className="text-xs text-gray-500">
                          January 15, 2025 at 2:30 PM
                        </p>
                      </div>
                    </Card>
                    <Card>
                      <div className="pl-4 py-1">
                        <p className="text-md font-medium mb-2">
                          Event submitted for approval
                        </p>
                        <p className="text-xs text-gray-500">
                          January 15, 2025 at 2:30 PM
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
                        event: "Saturday Night Fever",
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
                        event: "Friday Jazz Night",
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
      </div>
    </>
  );
}
