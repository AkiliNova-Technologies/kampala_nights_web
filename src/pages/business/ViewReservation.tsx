import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Reservation } from "@/types/reservation";
import { useReservations } from "@/hooks/useReservations";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ViewReservationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReservationById } = useReservations();
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (id) {
        const reservationId = parseInt(id);
        const reservationData = getReservationById(reservationId);
        setReservation(reservationData || null);
      }
      // setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, getReservationById]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader label="Reservations Dashboard" />
      <main className="flex-1 container mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="flex flex-row items-center mb-8 gap-6">
          <Button
            variant={"ghost"}
            onClick={() => navigate("/business/reservations")}
          >
            <ArrowLeft className="size-6" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Reservation Details
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 space-y-6 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Event Information Card */}
            <Card className="shadow-sm col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {reservation?.event}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {reservation?.eventDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">
                          {reservation?.eventDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-semibold">{reservation?.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">
                          {reservation?.eventTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Table & Guests
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-semibold">
                            {reservation?.table}
                          </Badge>
                          <span className="font-semibold">
                            • {reservation?.guests} guests
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer & Payment Information */}
            {/* Customer Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{reservation?.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">{reservation?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-semibold">{reservation?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="font-semibold">{reservation?.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Reservation Amount
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    USX {reservation?.amount.toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Payment Received
                </Badge>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {/* Event Image */}
            {reservation?.image && (
              <Card className="aspect-square p-0">
                <img
                  src={reservation?.image}
                  alt={reservation?.event}
                  className="h-full w-full object-cover"
                />
              </Card>
            )}
            {/* Reservation Timeline */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Reservation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="font-semibold">Reservation Created</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation?.reservationCreated}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      Completed
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="font-semibold">Payment Received</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation?.paymentReceived}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Completed
                    </Badge>
                  </div>

                  {reservation?.checkedIn && (
                    <div className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-semibold">Customer Checked In</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation?.checkedIn}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Completed
                      </Badge>
                    </div>
                  )}

                  {reservation?.eventAttended && (
                    <div className="flex justify-between items-center py-3">
                      <div>
                        <p className="font-semibold">Event Attended</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation?.eventAttended}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Completed
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
