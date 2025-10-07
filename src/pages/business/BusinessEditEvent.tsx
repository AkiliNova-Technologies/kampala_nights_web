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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function BusinessEditEventPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-5 items-center">
              <Button
                variant={"secondary"}
                className=""
                onClick={() => {
                  navigate(-1);
                }}
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

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Event Details</h2>

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
                    defaultValue="Summer Music Festival 2024"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium mb-2 block"
                  >
                    Category
                  </Label>
                  <Select defaultValue="music">
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
                  defaultValue="Join us for an unforgettable summer music festival featuring top artists, food trucks, and amazing vibes!"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">When & Where</h2>

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
                  defaultValue="2024-07-15"
                  className="h-11"
                />
              </div>

              <div>
                <Label
                  htmlFor="event-time"
                  className="text-sm font-medium mb-2 block"
                >
                  Event Time
                </Label>
                <Select defaultValue="evening">
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
                defaultValue="Central Park, New York"
                className="w-full h-11"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Capacity & Pricing</h2>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="max-capacity"
                  className="text-sm font-medium mb-2 block"
                >
                  Maximum Reservations
                </Label>
                <Input
                  id="max-capacity"
                  type="number"
                  placeholder="Enter maximum capacity"
                  defaultValue="300"
                  className="h-11"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="paid-event" />
                  <Label htmlFor="paid-event">Paid event</Label>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">Event Ticks</h2>
            </div>
          </div>

          <div className="flex justify-between space-x-2 pt-4">
            <Button variant="outline" className="h-11 flex-1">
              Cancel
            </Button>
            <Button
              variant={"secondary"}
              className="h-11 bg-[#5041D0] flex-1 text-white"
            >
              Update Event
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
