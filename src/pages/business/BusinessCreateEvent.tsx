import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image, MapPin, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import CapacityPricing from "@/components/capacity-pricing";
import { ImageUploadField } from "@/components/image-upload-field";
import { useState } from "react";
import { LocationInput } from "@/components/ui/location-input";
import { useReduxEvents } from "@/hooks/useReduxEvents";
import { toast } from "sonner";

interface EventFormData {
  eventTitle: string;
  category: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  latitude: number;
  longitude: number;
  maxAttendees: number;
  isPaidEvent: boolean;
  tickets: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  backgroundImageUrl: string | null;
  posterImageUrl: string | null;
}

// Helper function to convert time string to actual datetime
const getDateTimeFromTimeSlot = (date: string, timeSlot: string): string => {
  const dateObj = new Date(date);

  switch (timeSlot) {
    case "morning":
      dateObj.setHours(10, 0, 0, 0);
      break;
    case "afternoon":
      dateObj.setHours(14, 0, 0, 0);
      break;
    case "evening":
      dateObj.setHours(18, 0, 0, 0);
      break;
    case "all-day":
      dateObj.setHours(12, 0, 0, 0);
      break;
    default:
      dateObj.setHours(12, 0, 0, 0);
  }

  return dateObj.toISOString();
};

// Helper function to calculate end time (default to 3 hours after start)
const getEndDateTime = (startDateTime: string): string => {
  const endDate = new Date(startDateTime);
  endDate.setHours(endDate.getHours() + 3);
  return endDate.toISOString();
};

export function BusinessCreateEventPage() {
  const navigate = useNavigate();
  const { createEvent, loading: creatingEvent } = useReduxEvents({
    mode: "business",
  });

  const [uploadingImages, setUploadingImages] = useState({
    background: false,
    poster: false,
  });

  const handlePlaceSelect = (place: {
    address: string;
    placeId: string;
    lat?: number;
    lng?: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      location: place.address,
    }));
  };

  const [formData, setFormData] = useState<EventFormData>({
    eventTitle: "",
    category: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    latitude: 0,
    longitude: 0,
    maxAttendees: 0,
    isPaidEvent: false,
    tickets: [
      {
        id: "1",
        name: "",
        price: 0,
        quantity: 0,
      },
    ],
    backgroundImageUrl: null,
    posterImageUrl: null,
  });

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Background Image Handlers
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

  // Poster Image Handlers
  const handlePosterImageUpload = async (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      posterImageUrl: url,
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

  const handleCapacityPricingChange = (updates: {
    maxAttendees?: number;
    isPaidEvent?: boolean;
    tickets?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Form submission with API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.eventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!formData.eventDate) {
      toast.error("Please select an event date");
      return;
    }

    if (!formData.eventTime) {
      toast.error("Please select an event time");
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
    if (formData.isPaidEvent) {
      const invalidTickets = formData.tickets.filter(
        (ticket) =>
          !ticket.name.trim() || ticket.price <= 0 || ticket.quantity <= 0
      );

      if (invalidTickets.length > 0) {
        toast.error("Please fill in all ticket details correctly");
        return;
      }
    }

    // Validate images
    if (!formData.backgroundImageUrl) {
      toast.error("Please upload a background image");
      return;
    }

    if (!formData.posterImageUrl) {
      toast.error("Please upload a poster image");
      return;
    }

    try {
      // Prepare data for API
      const startDateTime = getDateTimeFromTimeSlot(
        formData.eventDate,
        formData.eventTime
      );
      const endDateTime = getEndDateTime(startDateTime);

      const eventData = {
        name: formData.eventTitle,
        description: formData.description,
        startDateTime,
        endDateTime,
        maxAttendees: formData.maxAttendees,
        eventType: formData.category,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        backgroundImageUrl: formData.backgroundImageUrl,
        coverImageUrl: formData.posterImageUrl,
        isPaid: formData.isPaidEvent,
        allowReservations: false,
        ticketTypes: formData.isPaidEvent
          ? formData.tickets.map((ticket) => ({
              name: ticket.name,
              price: ticket.price,
              quantity: ticket.quantity,
            }))
          : [],
        reservationPricing: [],
        media: [],
      };

      console.log("Creating event with data:", eventData);

      // Call the Redux action and check the result properly
      const result = await createEvent(eventData);

      // Check if the action was fulfilled by examining the result
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          "Event created successfully! It will be reviewed by admin."
        );
        navigate("/business/events");
      } else {
        throw new Error((result.payload as string) || "Failed to create event");
      }
    } catch (error: any) {
      console.error("Failed to create event:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    }
  };

  const handleCancel = () => {
    const hasData =
      formData.eventTitle.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.location.trim() !== "" ||
      formData.maxAttendees > 0 ||
      formData.backgroundImageUrl !== null ||
      formData.posterImageUrl !== null;

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
    !creatingEvent && !uploadingImages.background && !uploadingImages.poster;

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="event-title"
                      className="text-sm font-medium mb-2 block"
                    >
                      Event Title
                    </Label>
                    <Input
                      id="event-title"
                      placeholder="Enter event title"
                      value={formData.eventTitle}
                      onChange={(e) =>
                        handleInputChange("eventTitle", e.target.value)
                      }
                      className="h-11"
                      required
                      disabled={!isFormSubmittable}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="category"
                      className="text-sm font-medium mb-2 block"
                    >
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                      disabled={!isFormSubmittable}
                    >
                      <SelectTrigger className="w-full min-h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="concert">Concert</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="event-description"
                    className="text-sm font-medium mb-2 block"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="event-description"
                    placeholder="Describe your event..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
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
                    value={formData.eventDate}
                    onChange={(e) =>
                      handleInputChange("eventDate", e.target.value)
                    }
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
                    value={formData.eventTime}
                    onChange={(e) =>
                      handleInputChange("eventTime", e.target.value)
                    }
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
                isPaidEvent: formData.isPaidEvent,
                tickets: formData.tickets,
              }}
              onFormChange={handleCapacityPricingChange}
              disabled={!isFormSubmittable}
            />

            {/* Event Images Section */}
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
                {creatingEvent ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
