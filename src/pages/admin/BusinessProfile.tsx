import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusIcon,
  MapPin,
  Calendar,
  Globe,
  Building,
  ArrowLeft,
  Mail,
  Phone,
  CreditCard,
  User,
  // Settings,
  XCircle,
  Clock,
  CheckCircle,
  Music,
  // Users,
  // Champagne,
  // Crown,
} from "lucide-react";
import { SectionCards } from "@/components/section-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { EditBusinessDialog } from "@/components/edit-business-dialog";
import coverImage from "../../assets/images/nightclub-cover.png";
import profileImage from "../../assets/images/nightclub-logo.png";

export function BusinessProfilePage() {
  const navigate = useNavigate();
  // Mock business data for Nightlife Central - Kampala nightclub
  const businessData = {
    coverImage: coverImage,
    profileImage: profileImage,
    name: "Nightlife Central",
    status: "approved",
    description:
      "Premier nightclub experience in the heart of Kololo. Featuring world-class DJs, premium bottle service, and an unforgettable atmosphere with the best music in Kampala.",
    email: "info@nightlifecentral.ug",
    phone: "+256 772 123 456",
    location: "Kololo, Kampala",
    website: "https://nightlifecentral.ug",
    joinedDate: "2023-06-15",
    category: "Nightclub & Lounge",
    accountName: "Nightlife Central UG Ltd",
    bankName: "Stanbic Bank Uganda",
    accountNumber: "9030018290000",
    totalEvents: 127,
    eventGrowth: "+18%",
    totalRevenue: "UGX 89.4M",
    revenueGrowth: "+22%",
    totalReservations: "2,847",
    reservationGrowth: "+15%",
  };

  const recentEvents = [
    {
      id: 1,
      name: "Friday Night Live - DJ Shiru",
      date: "2024-01-19",
      attendees: 350,
      image: "",
      location: "Main Hall",
      type: "DJ Night",
      coverCharge: "UGX 20,000",
    },
    {
      id: 2,
      name: "VIP Bottle Service Launch",
      date: "2024-01-12",
      attendees: 180,
      image: "",
      location: "VIP Lounge",
      type: "Special Event",
      coverCharge: "UGX 50,000",
    },
    {
      id: 3,
      name: "New Year's Eve Countdown",
      date: "2023-12-31",
      attendees: 500,
      image: "",
      location: "Main Hall & Terrace",
      type: "Holiday Party",
      coverCharge: "UGX 30,000",
    },
    {
      id: 4,
      name: "AfroBeats Thursday",
      date: "2023-12-28",
      attendees: 280,
      image: "",
      location: "Main Hall",
      type: "Theme Night",
      coverCharge: "UGX 15,000",
    },
  ];

  const activeReservations = [
    {
      id: 1,
      customerName: "David Mugisha",
      customerAvatar: "",
      eventName: "Saturday Night Party",
      date: "2024-01-20",
      time: "10:00 PM",
      tableType: "VIP Booth A5",
      guests: 8,
    },
    {
      id: 2,
      customerName: "Sarah Nalwoga",
      customerAvatar: "",
      eventName: "Birthday Celebration",
      date: "2024-01-20",
      time: "9:30 PM",
      tableType: "Regular Table B2",
      guests: 6,
    },
    {
      id: 3,
      customerName: "Corporate UG Ltd",
      customerAvatar: "",
      eventName: "Team Building",
      date: "2024-01-21",
      time: "8:00 PM",
      tableType: "VIP Lounge Section",
      guests: 15,
    },
  ];

  const confirmedReservations = [
    {
      id: 1,
      eventName: "Friday Night Live",
      customerName: "James Kato",
      date: "2024-01-26",
      partySize: 4,
      status: "paid",
      priority: "high",
      tableType: "VIP Booth A1",
      totalAmount: "UGX 250,000",
    },
    {
      id: 2,
      eventName: "AfroBeats Thursday",
      customerName: "Maria Nakato",
      date: "2024-01-25",
      partySize: 6,
      status: "confirmed",
      priority: "medium",
      tableType: "Regular Table C3",
      totalAmount: "UGX 120,000",
    },
    {
      id: 3,
      eventName: "Saturday Night Party",
      customerName: "Tech Solutions UG",
      date: "2024-01-27",
      partySize: 12,
      status: "paid",
      priority: "high",
      tableType: "VIP Section",
      totalAmount: "UGX 600,000",
    },
    {
      id: 4,
      eventName: "Friday Night Live",
      customerName: "Peter Omondi",
      date: "2024-01-26",
      partySize: 2,
      status: "confirmed",
      priority: "low",
      tableType: "Bar Seating",
      totalAmount: "UGX 40,000",
    },
  ];

  const cancelledReservations = [
    {
      id: 1,
      eventName: "Thursday Ladies Night",
      customerName: "Grace Auma",
      date: "2024-01-18",
      reason: "Unexpected travel",
      refundStatus: "processed",
      amount: "UGX 30,000",
    },
    {
      id: 2,
      eventName: "Weekend Vibes",
      customerName: "Robert Ssempa",
      date: "2024-01-13",
      reason: "Change of plans",
      refundStatus: "pending",
      amount: "UGX 60,000",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        rightActions={
          <>
            <Button className="bg-[#5014D0] hover:bg-[#5014D0]/70 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </>
        }
      />

      <main className="flex-1">
        <div className="space-y-6 p-6">
          <div className="mx-auto">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="p-2 bg-background"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Business Profile</h1>
                  <p className="text-sm text-gray-500">
                    Comprehensive business details
                  </p>
                </div>
              </div>
              <EditBusinessDialog
                businessData={businessData}
                onSave={async (updatedData) => {
                  console.log("Updated business data:", updatedData);
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6">
          {/* Hero Section with Background Image */}
          <Card className="overflow-hidden mb-8 pt-0">
            {businessData.coverImage ? (
              <div className="relative h-50">
                <img
                  src={businessData.coverImage}
                  alt="Cover"
                  className="w-full h-50 object-cover"
                />
              </div>
            ) : (
              <div className="relative h-50 bg-gradient-to-r from-purple-900 via-pink-800 to-blue-900"></div>
            )}
            <div className="relative flex items-center space-x-4 px-6 w-full mt--12">
              <Avatar className="h-30 w-30 border-3 absolute -top-16">
                <AvatarImage
                  src={businessData.profileImage}
                  alt={businessData.name}
                />
                <AvatarFallback className="text-xl font-semibold">
                  {getInitials(businessData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-32">
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-2xl font-bold">{businessData.name}</h2>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
                    {businessData.status}
                  </Badge>
                </div>
                <p className="max-w-2xl">{businessData.description}</p>
              </div>
            </div>

            {/* Contact Info Grid */}
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        EMAIL
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        PHONE
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-red-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        LOCATION
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-orange-100 rounded-lg">
                      <Globe className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        WEBSITE
                      </p>
                      <a
                        href={businessData.website}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {businessData.website}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        JOINED
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.joinedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-indigo-100 rounded-lg">
                      <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        CATEGORY
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        ACCOUNT NAME
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.accountName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        BANK NAME
                      </p>
                      <p className="text-sm font-medium">
                        {businessData.bankName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        ACCOUNT NUMBER
                      </p>
                      <p className="text-sm font-medium font-mono">
                        {businessData.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <SectionCards
            cards={[
              {
                title: "Total Events",
                value: businessData.totalEvents.toString(),
                change: {
                  value: businessData.eventGrowth,
                  trend: "up",
                  description: "from last month",
                },
              },
              {
                title: "Total Revenue",
                value: businessData.totalRevenue,
                change: {
                  value: businessData.revenueGrowth,
                  trend: "up",
                  description: "from last month",
                },
              },
              {
                title: "Total Reservations",
                value: businessData.totalReservations.toLocaleString(),
                change: {
                  value: businessData.reservationGrowth,
                  trend: "up",
                  description: "from last month",
                },
              },
            ]}
            className="mb-8 gap-8"
            layout="1x3"
          />

          {/* Bottom Section */}
          <Tabs defaultValue="recent-events" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-transparent ">
              <TabsTrigger
                value="recent-events"
                className="text-md bg-transparent h-10 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-600"
              >
                Recent Events
              </TabsTrigger>
              <TabsTrigger
                value="reservation-details"
                className="text-md bg-transparent h-10 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-600"
              >
                Reservation Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent-events" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Recent Events
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Latest nightclub events and parties
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-200 text-green-800"
                    >
                      {recentEvents.length} events
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="">
                    {recentEvents.map((event) => (
                      <Card key={event.id} className="p-4 bg-card mb-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16 border-2 flex-shrink-0">
                            <AvatarImage
                              src={event.image || "/api/placeholder/80/80"}
                              alt={event.name}
                            />
                            <AvatarFallback className="text-lg font-semibold">
                              <Music className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-lg truncate">
                                    {event.name}
                                  </p>
                                  <Badge variant="outline" className="text-xs">
                                    {event.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {new Date(event.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}{" "}
                                  • {event.attendees} attendees
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  {event.location && (
                                    <p className="text-sm text-muted-foreground flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {event.location}
                                    </p>
                                  )}
                                  <p className="text-sm font-medium text-green-600">
                                    {event.coverCharge}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-4 flex-shrink-0"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reservation-details" className="mt-4">
              <Card>
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Reservation Details
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Manage table bookings and VIP reservations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6">
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full h-10 grid-cols-3 rounded-none p-0 bg-transparent border-b">
                      <TabsTrigger
                        value="active"
                        className="h-10 bg-transparent border-0 rounded-none data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Active</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="confirmed"
                        className="h-10 bg-transparent border-0 rounded-none data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Confirmed</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="cancelled"
                        className="h-10 bg-transparent border-0 rounded-none data-[state=active]:border-b-3 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                      >
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4" />
                          <span>Cancelled</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>

                    {/* Active Reservations Tab */}
                    <TabsContent value="active" className="py-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">
                              VIP Bookings
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-purple-800/30 text-purple-800"
                            >
                              5
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">Premium reservations</p>
                        </Card>
                        <Card className="p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">
                              Tonight's Events
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-amber-800/30 text-amber-800"
                            >
                              3
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">Happening today</p>
                        </Card>
                        <Card className="p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">
                              This Weekend
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-blue-800/30 text-blue-800"
                            >
                              8
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">Weekend parties</p>
                        </Card>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Upcoming Reservations</h4>
                        {activeReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={reservation.customerAvatar} />
                                <AvatarFallback>
                                  {getInitials(reservation.customerName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {reservation.customerName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reservation.eventName}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {reservation.tableType}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {reservation.guests} guests
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {new Date(
                                  reservation.date
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {reservation.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Confirmed Reservations Tab */}
                    <TabsContent value="confirmed" className="py-6 space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">
                            Confirmed Reservations
                          </h4>
                          <p className="text-sm text-gray-500">
                            Paid and confirmed table bookings
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            45
                          </p>
                          <p className="text-xs text-green-600">+8 this week</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {confirmedReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-2 h-8 rounded-full ${
                                  reservation.priority === "high"
                                    ? "bg-red-500"
                                    : reservation.priority === "medium"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                }`}
                              ></div>
                              <div>
                                <p className="font-medium text-sm">
                                  {reservation.eventName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reservation.customerName} •{" "}
                                  {reservation.partySize} guests
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {reservation.tableType}
                                  </Badge>
                                  <span className="text-xs font-medium">
                                    {reservation.totalAmount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {new Date(
                                  reservation.date
                                ).toLocaleDateString()}
                              </p>
                              <Badge
                                variant={
                                  reservation.status === "paid"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  reservation.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {reservation.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Cancelled Reservations Tab */}
                    <TabsContent value="cancelled" className="py-6 space-y-4">
                      <div className="bg-red-500/10 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-lg text-red-800">
                              Cancellation Overview
                            </h4>
                            <p className="text-sm text-red-600">
                              {cancelledReservations.length} cancellations this
                              month
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">4%</p>
                            <p className="text-xs text-red-600">
                              cancellation rate
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Cancellations</h4>
                        {cancelledReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <XCircle className="h-5 w-5 text-red-500" />
                              <div>
                                <p className="font-medium text-sm">
                                  {reservation.eventName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {reservation.customerName}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-red-500">
                                    {reservation.reason}
                                  </p>
                                  <Badge variant="outline" className="text-xs">
                                    {reservation.refundStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium line-through">
                                {new Date(
                                  reservation.date
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-red-500">
                                {reservation.amount}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* <div className="border-t p-4 ">
                  <Button className="w-full h-12 text-white text-md bg-blue-600 hover:bg-blue-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage All Reservations
                  </Button>
                </div> */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
