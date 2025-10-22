import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image, MapPin, ReceiptText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import CapacityPricing from "@/components/capacity-pricing";
import { ImageUploadField } from "@/components/image-upload-field";
import { useState, useEffect } from "react";
import { useReduxEvents } from "@/hooks/useReduxEvents";
import { toast } from "sonner";
import { LocationInput } from "@/components/ui/location-input";

interface EventFormData {
  name: string;
  description: string;
  eventType: string;

  // When & Where
  startDateTime: string;
  endDateTime: string;
  location: string;
  latitude: number;
  longitude: number;

  // Capacity & Pricing
  maxAttendees: number;
  isPaid: boolean;
  allowReservations: boolean;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  groupPricing: {
    group1_3: number;
    group4_6: number;
    group7_10: number;
  };

  backgroundImageUrl: string | null;
  coverImageUrl: string | null;
}

// Helper functions to format dates for form inputs
const getDateFromISO = (isoString: string): string => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
};

const getTimeFromISO = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toTimeString().slice(0, 5); // Returns "HH:mm" format
};

// Helper function to combine date and time into ISO string
const combineDateTime = (date: string, time: string): string => {
  if (!date || !time) return "";
  return new Date(`${date}T${time}`).toISOString();
};

export function BusinessEditEventPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentEvent, fetchBusinessEventById, updateBusinessEvent, loading } =
    useReduxEvents({ mode: "business" });

  console.log("Event Details: ", currentEvent);

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    eventType: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    latitude: 0,
    longitude: 0,
    maxAttendees: 0,
    isPaid: false,
    allowReservations: false,
    ticketTypes: [],
    groupPricing: {
      group1_3: 0,
      group4_6: 0,
      group7_10: 0,
    },
    backgroundImageUrl: null,
    coverImageUrl: null,
  });

  // Separate state for date and time inputs
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const [uploadingImages, setUploadingImages] = useState({
    background: false,
    poster: false,
  });

  useEffect(() => {
    if (id) {
      fetchBusinessEventById(id);
    }
  }, [id, fetchBusinessEventById]);

  // Populate form when currentEvent changes
  useEffect(() => {
    if (currentEvent && currentEvent.id === id) {
      // Use groupPricing instead of eventReservationPricing
      const groupPricing = currentEvent.groupPricing?.[0] || {};

      // Format dates for form inputs
      const eventDate = getDateFromISO(currentEvent.startDateTime);
      const eventTime = getTimeFromISO(currentEvent.startDateTime);

      setFormData({
        name: currentEvent.name || "",
        description: currentEvent.description || "",
        eventType: currentEvent.eventType || "",
        startDateTime: currentEvent.startDateTime || "",
        endDateTime: currentEvent.endDateTime || "",
        location: currentEvent.location || "",
        latitude: currentEvent.latitude || 0,
        longitude: currentEvent.longitude || 0,
        maxAttendees: currentEvent.maxAttendees || 0,
        isPaid: currentEvent.isPaid || false,
        allowReservations: currentEvent.allowReservations || false,
        ticketTypes:
          currentEvent.eventTicketTypes?.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
          })) || [],
        groupPricing: {
          group1_3: groupPricing.group1_3 || 0,
          group4_6: groupPricing.group4_6 || 0,
          group7_10: groupPricing.group7_10 || 0,
        },
        backgroundImageUrl: currentEvent.backgroundImageUrl || null,
        coverImageUrl: currentEvent.coverImageUrl || null,
      });

      // Set separate date and time inputs
      setDateInput(eventDate);
      setTimeInput(eventTime);
    }
  }, [currentEvent, id]);

  // Handle text input changes
  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle date input change
  const handleDateChange = (value: string) => {
    setDateInput(value);
    if (value && timeInput) {
      const newStartDateTime = combineDateTime(value, timeInput);
      setFormData((prev) => ({
        ...prev,
        startDateTime: newStartDateTime,
        // Auto-set end date time to 3 hours after start
        endDateTime: new Date(
          new Date(newStartDateTime).getTime() + 3 * 60 * 60 * 1000
        ).toISOString(),
      }));
    }
  };

  // Handle time input change
  const handleTimeChange = (value: string) => {
    setTimeInput(value);
    if (dateInput && value) {
      const newStartDateTime = combineDateTime(dateInput, value);
      setFormData((prev) => ({
        ...prev,
        startDateTime: newStartDateTime,
        // Auto-set end date time to 3 hours after start
        endDateTime: new Date(
          new Date(newStartDateTime).getTime() + 3 * 60 * 60 * 1000
        ).toISOString(),
      }));
    }
  };

  const handlePlaceSelect = (place: {
    address: string;
    placeId: string;
    lat?: number;
    lng?: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      location: place.address,
      latitude: place.lat || 0,
      longitude: place.lng || 0,
    }));
  };

  const handleBackgroundImageUpload = async (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      backgroundImageUrl: url,
    }));
    setUploadingImages((prev) => ({ ...prev, background: false }));
    if (url) {
      toast.success("Background image uploaded successfully!");
    }
  };

  const handleBackgroundImageError = (error: string) => {
    toast.error(`Background image upload failed: ${error}`);
    setUploadingImages((prev) => ({ ...prev, background: false }));
  };

  const handleBackgroundImageStart = () => {
    setUploadingImages((prev) => ({ ...prev, background: true }));
  };

  const handlePosterImageUpload = async (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      coverImageUrl: url, // Fixed: should be coverImageUrl, not posterImageUrl
    }));
    setUploadingImages((prev) => ({ ...prev, poster: false }));
    if (url) {
      toast.success("Poster image uploaded successfully!");
    }
  };

  const handlePosterImageError = (error: string) => {
    toast.error(`Poster image upload failed: ${error}`);
    setUploadingImages((prev) => ({ ...prev, poster: false }));
  };

  const handlePosterImageStart = () => {
    setUploadingImages((prev) => ({ ...prev, poster: true }));
  };

  // Handle capacity pricing changes
  const handleCapacityPricingChange = (updates: {
    maxAttendees?: number;
    isPaidEvent?: boolean;
    tickets?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    groupPricing?: {
      group1_3: number;
      group4_6: number;
      group7_10: number;
    };
  }) => {
    setFormData((prev) => ({
      ...prev,
      maxAttendees: updates.maxAttendees ?? prev.maxAttendees,
      isPaid: updates.isPaidEvent ?? prev.isPaid,
      ticketTypes: updates.tickets ?? prev.ticketTypes,
      groupPricing: updates.groupPricing ?? prev.groupPricing,
      allowReservations:
        updates.isPaidEvent === false ? true : prev.allowReservations, // Auto-enable reservations for free events
    }));
  };

  // Form submission
  // Form submission - Updated to match UpdateEventData interface
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Event ID is missing");
      return;
    }

    // Basic validation (keep your existing validation logic)
    if (!formData.name.trim()) {
      toast.error("Please enter an event name");
      return;
    }

    if (!formData.eventType) {
      toast.error("Please select an event type");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.startDateTime) {
      toast.error("Please select an event date and time");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    if (formData.maxAttendees <= 0) {
      toast.error("Please enter a valid number of maximum attendees");
      return;
    }

    // Validate tickets if it's a paid event
    if (formData.isPaid && formData.ticketTypes.length > 0) {
      const invalidTickets = formData.ticketTypes.filter(
        (ticket) =>
          !ticket.name.trim() || ticket.price <= 0 || ticket.quantity <= 0
      );

      if (invalidTickets.length > 0) {
        toast.error("Please fill in all ticket details correctly");
        return;
      }
    }

    // Validate group pricing if it's a free event with reservations
    if (!formData.isPaid && formData.allowReservations) {
      const { group1_3, group4_6, group7_10 } = formData.groupPricing;
      if (group1_3 <= 0 && group4_6 <= 0 && group7_10 <= 0) {
        toast.error("Please set prices for at least one group size");
        return;
      }
    }

    try {
      // Prepare data for API - Match the UpdateEventData interface
      const eventData = {
        name: formData.name,
        description: formData.description,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        maxAttendees: formData.maxAttendees,
        eventType: formData.eventType,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        backgroundImageUrl: formData.backgroundImageUrl ?? undefined,
        coverImageUrl: formData.coverImageUrl ?? undefined,
        isPaid: formData.isPaid,
        allowReservations: formData.allowReservations,

        // Use the field names expected by UpdateEventData
        ticketTypes: formData.isPaid
          ? formData.ticketTypes.map((ticket) => ({
              id: ticket.id,
              name: ticket.name,
              price: ticket.price,
              quantity: ticket.quantity,
              soldCount: 0, // Default for new tickets
              isActive: true,
              createdAt: new Date().toISOString(),
            }))
          : [],

        // Use reservationPricing if that's what UpdateEventData expects
        reservationPricing:
          !formData.isPaid && formData.allowReservations
            ? [
                {
                  id: `group-${Date.now()}`,
                  group1_3: formData.groupPricing.group1_3,
                  group4_6: formData.groupPricing.group4_6,
                  group7_10: formData.groupPricing.group7_10,
                  isActive: true,
                  createdAt: new Date().toISOString(),
                },
              ]
            : [],

        media: [], // Add empty media array if required
      };

      console.log("Updating event with data:", eventData);

      // Call the Redux action
      const result = await updateBusinessEvent(id, eventData);

      // Check if the action was fulfilled
      if (result.meta?.requestStatus === "fulfilled") {
        toast.success("Event updated successfully!");
        navigate("/business/events");
      } else {
        throw new Error((result.payload as string) || "Failed to update event");
      }
    } catch (error: any) {
      console.error("Failed to update event:", error);
      toast.error(error.message || "Failed to update event. Please try again.");
    }
  };

  const handleCancel = () => {
    const hasData =
      formData.name.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.location.trim() !== "" ||
      formData.maxAttendees > 0;

    if (hasData) {
      if (
        window.confirm(
          "Are you sure you want to cancel? Any unsaved changes will be lost."
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const isFormSubmittable =
    !loading && !uploadingImages.background && !uploadingImages.poster;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-5 items-center">
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={() => navigate(-1)}
                  disabled={!isFormSubmittable}
                >
                  <ArrowLeft />
                </Button>
                <p>Back to Events Dashboard</p>
              </div>
              <div className="space-x-2">
                <Badge className="px-4 py-1 text-sm text-[#B45309] bg-background dark:bg-card rounded-sm">
                  Events require admin approval
                </Badge>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center gap-4 mb-6">
                <div className="h-8 w-8 flex flex-row items-center justify-center bg-[#EEF2FF] rounded-sm">
                  <ReceiptText className="text-[#5014D0] size-5" />
                </div>

                <h2 className="text-xl font-semibold">Event Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <Label
                      htmlFor="event-name"
                      className="text-sm font-medium mb-2 block"
                    >
                      Event Name
                    </Label>
                    <Input
                      id="event-name"
                      placeholder="Enter event name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="h-11"
                      required
                      disabled={!isFormSubmittable}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium mb-2 block"
                  >
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="h-11"
                    required
                    disabled={!isFormSubmittable}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="event-type"
                    className="text-sm font-medium mb-2 block"
                  >
                    Event Type
                  </Label>
                  <Input
                    id="event-type"
                    placeholder="e.g., party, music, art, social"
                    value={formData.eventType}
                    onChange={(e) =>
                      handleInputChange("eventType", e.target.value)
                    }
                    className="h-11"
                    required
                    disabled={!isFormSubmittable}
                  />
                </div>
              </div>
            </div>

            {/* When & Where Section */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-3">
                <div className="h-8 w-8 bg-[#FAFAFA] rounded-sm flex flex-col justify-center items-center">
                  <MapPin className="size-6 text-[#737373]" />
                </div>
                <h2 className="text-xl font-semibold mb-6">When & Where</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label
                    htmlFor="event-date"
                    className="text-sm font-medium mb-2 block"
                  >
                    Event Date
                  </Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={dateInput}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="h-11"
                    required
                    disabled={!isFormSubmittable}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="event-time"
                    className="text-sm font-medium mb-2 block"
                  >
                    Event Time
                  </Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={timeInput}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="h-11"
                    required
                    disabled={!isFormSubmittable}
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium mb-2 block"
                >
                  Location
                </Label>
                <LocationInput
                  id="location"
                  icon={<MapPin className="size-5" />}
                  value={formData.location}
                  onChange={(value) => handleInputChange("location", value)}
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Enter event location"
                  country="ug"
                  className="w-full h-11"
                  required
                  disabled={!isFormSubmittable}
                />
              </div>
            </div>

            {/* Capacity & Pricing Section */}
            <CapacityPricing
              formData={{
                maxAttendees: formData.maxAttendees,
                isPaidEvent: formData.isPaid,
                tickets: formData.ticketTypes,
                groupPricing: formData.groupPricing,
              }}
              onFormChange={handleCapacityPricingChange}
              disabled={!isFormSubmittable}
            />

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-row items-center gap-4 mb-6">
                <div className="h-8 w-8 bg-[#0066CC] rounded-sm flex flex-row items-center justify-center">
                  <Image className="size-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Event Images</h2>
              </div>

              <div className="space-y-8">
                {/* Background Image */}
                <div className="space-y-4">
                  <ImageUploadField
                    label="Background Image"
                    description="Event background image. Used for event banners and hero sections."
                    recommendedSize="1920×1080px"
                    formats="JPEG or PNG"
                    maxSize={10}
                    onImageUpload={handleBackgroundImageUpload}
                    onUploadError={handleBackgroundImageError}
                    onUploadStart={handleBackgroundImageStart}
                    existingImageUrl={formData.backgroundImageUrl}
                  />
                </div>

                {/* Poster Image */}
                <div className="space-y-4">
                  <ImageUploadField
                    label="Poster Image"
                    description="Event poster for cards and listings."
                    recommendedSize="400×300px"
                    formats="JPG, PNG, WebP"
                    maxSize={10}
                    onImageUpload={handlePosterImageUpload}
                    onUploadError={handlePosterImageError}
                    onUploadStart={handlePosterImageStart}
                    existingImageUrl={formData.coverImageUrl}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1"
                onClick={handleCancel}
                disabled={!isFormSubmittable}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"secondary"}
                className="h-11 bg-[#5041D0] flex-1 text-white hover:bg-[#5041D0]/90"
                disabled={!isFormSubmittable}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Event...
                  </>
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
