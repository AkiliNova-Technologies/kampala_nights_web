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

interface EventFormData {
  eventTitle: string;
  category: string;
  description: string;

  eventDate: string;
  eventTime: string;
  location: string;

  maxAttendees: number;
  isPaidEvent: boolean;
  tickets: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;

  backgroundImage: File | null;
  posterImage: File | null;
}

export function BusinessCreateEventPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    eventTitle: "",
    category: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
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
    backgroundImage: null,
    posterImage: null,
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

  const handleBackgroundImageChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      backgroundImage: file,
    }));
  };

  const handlePosterImageChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      posterImage: file,
    }));
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

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.eventTitle.trim()) {
      alert("Please enter an event title");
      return;
    }

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!formData.eventDate) {
      alert("Please select an event date");
      return;
    }

    if (!formData.eventTime) {
      alert("Please select an event time");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter a location");
      return;
    }

    if (formData.maxAttendees <= 0) {
      alert("Please enter a valid number of maximum attendees");
      return;
    }

    // Log all form data (replace with your API call)
    console.log("Form Data:", formData);

    // Here you would typically send the data to your backend
    // Example API call:
    // createEvent(formData).then(() => {
    //   navigate('/events');
    // });

    // For now, just log and show success
    alert("Event created successfully!");
    console.log("Complete form data:", JSON.stringify(formData, null, 2));
  };

  const handleCancel = () => {
    // Check if there's any data entered
    const hasData = 
      formData.eventTitle.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.location.trim() !== "" ||
      formData.maxAttendees > 0 ||
      formData.backgroundImage !== null ||
      formData.posterImage !== null;

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
                    >
                      <SelectTrigger className="w-full min-h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
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
                  />
                </div>

                <div>
                  <Label
                    htmlFor="event-time"
                    className="text-sm font-medium mb-2 block"
                  >
                    Event Time
                  </Label>
                  <Select
                    value={formData.eventTime}
                    onValueChange={(value) =>
                      handleSelectChange("eventTime", value)
                    }
                  >
                    <SelectTrigger className="h-11 min-h-11 w-full">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="all-day">All Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium mb-2 block"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full h-11"
                  required
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
                    maxSize="10MB"
                    onImageChange={handleBackgroundImageChange}
                  />
                </div>

                {/* Poster Image */}
                <div className="space-y-4">
                  <ImageUploadField
                    label="Poster Image"
                    description="Event poster for cards and listings."
                    recommendedSize="400×300px"
                    formats="JPG, PNG, WebP"
                    maxSize="10MB"
                    onImageChange={handlePosterImageChange}
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"secondary"}
                className="h-11 bg-[#5041D0] flex-1 text-white hover:bg-[#5041D0]/90"
              >
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}