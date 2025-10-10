import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileInput } from "@/components/profile-input";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Tag,
  Building,
  CreditCard,
  Captions,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordInput } from "@/components/ui/password";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CoverImageComponent,
  ProfileImageComponent,
} from "@/components/profile-image";
import { useState } from "react";
import { ArrayInput } from "@/components/array-input";

const businessProfileData = {
  name: "Nightlife Central",
  status: "Pending",
  description:
    "Premier nightclub experience in the heart of Kololo. Featuring world-class DJs, premium bottle service, and an unforgettable atmosphere.",
  contact: {
    email: "john@nightlifecentral.com",
    phone: "+1 (555) 123-4567",
    location: "Kololo",
    website: "https://nightlifecentral.com",
    joined: "2024-01-15",
    category: "Nightclub",
  },
  banking: {
    accountName: "Nightlife Central LLC",
    bankName: "DTB Bank",
    accountNumber: "1268290000282629",
  },
  services: ["Free Wifi", "Parking", "Live Music"],
  locationVerification: {
    currentLocation: "Kololo",
    status: "Unverified",
  },
  images: {
    cover: "",
    profile: "",
  },
};

export function BusinessSettingsPage() {
  const [services, setServices] = useState<string[]>([
    "Free Wifi",
    "Parking",
    "Live Music",
  ]);
  const [coverImage, setCoverImage] = useState<string | null>();
  const [profileImage, setProfileImage] = useState<string | null>();

  const handleCoverImageChange = (file: File) => {
    console.log("Cover image changed:", file);

    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
  };

  const handleCoverImageRemove = () => {
    console.log("Cover image removed");
    setCoverImage(null);
  };

  const handleProfileImageChange = (file: File) => {
    console.log("Profile image changed:", file);

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleProfileImageRemove = () => {
    console.log("Profile image removed");
    setProfileImage(null);
  };

  const handleSave = (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);
    // Handle save logic for profile inputs
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent mb-4 rounded-none border-b-2 border-[#5014D0] h-11 px-0">
              <TabsTrigger
                value="profile"
                className="h-10 border-0 rounded-none rounded-t-md data-[state=active]:dark:bg-[#5014D0] data-[state=active]:bg-[#5014D0] data-[state=active]:text-white text-md"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="passwords"
                className="h-10 border-0 rounded-none rounded-t-md data-[state=active]:dark:bg-[#5014D0] data-[state=active]:bg-[#5014D0] data-[state=active]:text-white text-md"
              >
                Passwords
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              {/* Main Content Card */}
              <Card className="overflow-hidden pt-0">
                {/* Cover Image Section - spans full width of card */}
                <div className="w-full relative">
                  <CoverImageComponent
                    src={coverImage || businessProfileData.images.cover}
                    alt={businessProfileData.name + " cover image"}
                    onImageChange={handleCoverImageChange}
                    onImageRemove={handleCoverImageRemove}
                    editable={true}
                    aspectRatio="auto"
                    className="rounded-t-lg"
                  />
                </div>

                <CardHeader className="relative">
                  {/* Profile Image positioned over the cover image */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-start gap-6 ">
                    <ProfileImageComponent
                      src={profileImage || businessProfileData.images.profile}
                      alt={businessProfileData.name + " profile image"}
                      onImageChange={handleProfileImageChange}
                      onImageRemove={handleProfileImageRemove}
                      editable={true}
                      size="lg"
                      fallback={getInitials(businessProfileData.name)}
                      className="border-2 border-background -mt-18"
                    />

                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-2xl font-bold">
                          {businessProfileData.name}
                        </CardTitle>
                        <Badge className="inline-flex items-center bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          {businessProfileData.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {/* Business Description */}
                        <p className="text-muted-foreground text-md">
                          {businessProfileData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-0">
                  <Separator />

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <ProfileInput
                        icon={Mail}
                        label="EMAIL"
                        value={businessProfileData.contact.email}
                        isEditable={false}
                        onSave={(value) => handleSave("email", value)}
                      />
                      <ProfileInput
                        icon={Phone}
                        label="PHONE"
                        value={businessProfileData.contact.phone}
                        isEditable={false}
                        onSave={(value) => handleSave("phone", value)}
                      />
                      <ProfileInput
                        icon={MapPin}
                        label="LOCATION"
                        value={businessProfileData.contact.location}
                        isEditable={false}
                        onSave={(value) => handleSave("location", value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <ProfileInput
                        icon={Globe}
                        label="WEBSITE"
                        value={businessProfileData.contact.website}
                        isEditable={true}
                        onSave={(value) => handleSave("website", value)}
                      />
                      <ProfileInput
                        icon={Calendar}
                        label="JOINED"
                        value={businessProfileData.contact.joined}
                        isEditable={false}
                      />
                      <ProfileInput
                        icon={Tag}
                        label="CATEGORY"
                        value={businessProfileData.contact.category}
                        isEditable={false}
                      />
                    </div>

                    <div className="space-y-4">
                      <ProfileInput
                        icon={Building}
                        label="ACCOUNT NAME"
                        value={businessProfileData.banking.accountName}
                        isEditable={true}
                        onSave={(value) => handleSave("accountName", value)}
                      />
                      <div className="space-y-4">
                        <ProfileInput
                          icon={Captions}
                          label="BANK NAME"
                          value={businessProfileData.banking.bankName}
                          isEditable={true}
                          onSave={(value) => handleSave("bankName", value)}
                        />
                        <ProfileInput
                          icon={CreditCard}
                          label="ACCOUNT NUMBER"
                          value={businessProfileData.banking.accountNumber}
                          isEditable={true}
                          onSave={(value) => handleSave("accountNumber", value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Services & Amenities Section */}
                  <div className="space-y-4">
                    <ArrayInput
                      label="Services & Amenities"
                      values={services}
                      onChange={setServices}
                      buttonLabel="Add Amenity"
                      placeholder="Add a service or amenity"
                      suggestions={[
                        "Free WiFi",
                        "Parking",
                        "Live Music",
                        "Security",
                        "Food & Drinks",
                        "VIP Section",
                        "Outdoor Seating",
                      ]}
                    />
                  </div>

                  <Separator />

                  {/* Location Verification */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">
                          Location Verification
                        </Label>
                        <p className="mt-1 text-muted-foreground">
                          Current location:{" "}
                          {
                            businessProfileData.locationVerification
                              .currentLocation
                          }
                        </p>
                      </div>
                      <Badge className="text-[#B45309] py-1 border-[#FBBF24] bg-yellow-100 px-2">
                        {businessProfileData.locationVerification.status}
                      </Badge>
                    </div>
                    <Button variant={"outline"} className="w-full h-12 text-md">
                      <MapPin className="size-5" />
                      Confirm Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passwords" className="mt-4">
              <Card className="p-6 w-full">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    Create Your Password
                  </CardTitle>
                  <CardDescription className="text-md">
                    For security reasons, please create a new permanent password
                    for your account.
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="current-password"
                        className="text-sm font-medium"
                      >
                        Current Password
                      </Label>
                      <PasswordInput
                        id="current-password"
                        placeholder="Enter your current password"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="new-password"
                        className="text-sm font-medium"
                      >
                        New Password
                      </Label>
                      <PasswordInput
                        id="new-password"
                        placeholder="Enter your new password"
                        className="h-12"
                        showStrength={true}
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters long and include
                        uppercase, lowercase, and numbers.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="confirm-password"
                        className="text-sm font-medium"
                      >
                        Confirm New Password
                      </Label>
                      <PasswordInput
                        id="confirm-password"
                        placeholder="Confirm your new password"
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Action Buttons with proper spacing */}
                  <div className="flex gap-6 pt-6">
                    <Button
                      type="submit"
                      className="h-12 text-md px-8 bg-[#5014D0] hover:bg-[#3f10a8] text-white flex-1"
                    >
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 text-md px-8 border-border hover:bg-muted/50 flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
