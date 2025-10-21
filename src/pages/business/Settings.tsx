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
import { useState, useEffect } from "react";
import { ArrayInput } from "@/components/array-input";
import { useReduxProfile } from "@/hooks/useReduxProfile";
import { toast } from "sonner";
import { LocationVerification } from "@/components/location-verification";
import type { Address } from "@/hooks/useGeoLocation";
import {
  updateCompanyDetails,
  updateLocationAmenities,
} from "@/redux/slices/profileSlice";
import { useAppDispatch } from "@/redux/hooks";
interface BusinessProfileData {
  // Company Details
  companyName: string;
  businessType: string;
  phone: string;
  address: string;
  website?: string;

  // Bank Information
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };

  // Location & Amenities
  location?: {
    latitude: number;
    longitude: number;
    address?: Address;
  };
  amenities: string[];

  // Images
  coverImage?: File | string | null;
  profileImage?: File | string | null;

  // Password (only when changing)
  password?: {
    currentPassword: string;
    newPassword: string;
  };
}

export function BusinessSettingsPage() {
  const dispatch = useAppDispatch();
  const [services, setServices] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>();
  const [profileImage, setProfileImage] = useState<string | null>();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: Address;
  } | null>(null);

  // Track changes for batch update
  const [pendingUpdates, setPendingUpdates] = useState<
    Partial<BusinessProfileData>
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    userProfile,
    businessProfile,
    updating,
    getBusinessProfile,
    getUserProfile,
    changePassword,
    clearError,
    // Add these if available in your Redux profile hook
    // updateBankInfo,
    // uploadProfileImage,
    // uploadCoverImage,
  } = useReduxProfile();

  // Fetch profile data on component mount
  useEffect(() => {
    getBusinessProfile();
    getUserProfile();
  }, [getBusinessProfile, getUserProfile]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Update services when business profile amenities change
  useEffect(() => {
    if (businessProfile?.amenities) {
      setServices(businessProfile.amenities);
    }
  }, [businessProfile?.amenities]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges =
      Object.keys(pendingUpdates).length > 0 ||
      coverImageFile !== null ||
      profileImageFile !== null ||
      passwordData.currentPassword !== "" ||
      passwordData.newPassword !== "";
    setHasUnsavedChanges(hasChanges);
  }, [pendingUpdates, coverImageFile, profileImageFile, passwordData]);

  const handleCoverImageChange = (file: File) => {
    console.log("Cover image changed:", file);
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
    setCoverImageFile(file);
    setHasUnsavedChanges(true);
  };

  const handleCoverImageRemove = () => {
    console.log("Cover image removed");
    setCoverImage(null);
    setCoverImageFile(null);
    setPendingUpdates((prev) => ({ ...prev, coverImage: null }));
    setHasUnsavedChanges(true);
  };

  const handleProfileImageChange = (file: File) => {
    console.log("Profile image changed:", file);
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setProfileImageFile(file);
    setHasUnsavedChanges(true);
  };

  const handleProfileImageRemove = () => {
    console.log("Profile image removed");
    setProfileImage(null);
    setProfileImageFile(null);
    setPendingUpdates((prev) => ({ ...prev, profileImage: null }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);

    if (!businessProfile) return;

    try {
      const updates: Partial<BusinessProfileData> = {};

      switch (field) {
        case "website":
          updates.website = value;
          break;
        case "accountName":
          updates.companyName = value;
          updates.bankInfo = {
            accountName: value,
            accountNumber: businessProfile.bankInfo?.accountNumber ?? "",
            bankName: businessProfile.bankInfo?.bankName ?? "",
          };
          break;
        case "bankName":
          updates.bankInfo = {
            accountName: businessProfile.bankInfo?.accountName ?? "",
            accountNumber: businessProfile.bankInfo?.accountNumber ?? "",
            bankName: value ?? "",
          };
          break;
        case "accountNumber":
          updates.bankInfo = {
            accountName: businessProfile.bankInfo?.accountName
              ? businessProfile.bankInfo.accountName
              : "",
            accountNumber: value ? value : "",
            bankName: businessProfile.bankInfo?.bankName
              ? businessProfile.bankInfo.bankName
              : "",
          };
          break;
        case "phone":
          updates.phone = value;
          break;
        case "address":
          updates.address = value;
          break;
        default:
          break;
      }

      // Add to pending updates
      setPendingUpdates((prev) => ({ ...prev, ...updates }));

      // If it's a critical field that should be saved immediately, uncomment below:
      // await saveToBackend(updates);

      toast.success(`${field} updated locally`);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleServicesUpdate = async (newServices: string[]) => {
    setServices(newServices);
    setPendingUpdates((prev) => ({ ...prev, amenities: newServices }));
    setHasUnsavedChanges(true);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: "",
      }).unwrap();

      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleLocationVerified = (
    location: { latitude: number; longitude: number },
    address?: Address
  ) => {
    const locationData = { ...location, address };
    setUserLocation(locationData);

    setPendingUpdates((prev) => ({
      ...prev,
      location: locationData,
      address: address?.fullAddress || businessProfile?.address || "",
    }));
    setHasUnsavedChanges(true);

    console.log("Location verified:", location);
    console.log("Address details:", address);
  };

  // Compile all data for backend submission
  const compileBusinessData = (): BusinessProfileData => {
    const baseData = {
      companyName: businessProfile?.companyName || "",
      businessType: businessProfile?.businessType || "",
      phone: businessProfile?.phone || "",
      address: businessProfile?.address || "",
      website: businessProfile?.website || "",
      bankInfo: businessProfile?.bankInfo || {
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      amenities: services,
      location:
        userLocation ||
        (businessProfile?.latitude && businessProfile?.longitude
          ? {
              latitude: businessProfile.latitude,
              longitude: businessProfile.longitude,
            }
          : undefined),
    };

    // Merge with pending updates
    const mergedData: BusinessProfileData = {
      ...baseData,
      ...pendingUpdates,
      amenities: pendingUpdates.amenities || services,
    };

    // Add image files if they exist
    if (coverImageFile) {
      mergedData.coverImage = coverImageFile;
    }
    if (profileImageFile) {
      mergedData.profileImage = profileImageFile;
    }

    // Add password if it's being changed
    if (passwordData.currentPassword && passwordData.newPassword) {
      mergedData.password = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
    }

    return mergedData;
  };

  // Main function to save all changes to backend
  const handleSaveAllChanges = async () => {
    if (!hasUnsavedChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      const dataToSend = compileBusinessData();
      console.log("Sending data to backend:", dataToSend);

      // Array to track all API calls
      const apiCalls: Promise<any>[] = [];

      // Debug: Check what updates are pending
      console.log("Pending updates:", pendingUpdates);
      console.log("Has location:", dataToSend.location);
      console.log("Has amenities:", dataToSend.amenities);

      // 1. Update Company Details (if changed)
      const hasCompanyUpdates =
        pendingUpdates.companyName ||
        pendingUpdates.businessType ||
        pendingUpdates.phone ||
        pendingUpdates.address ||
        pendingUpdates.website;

      if (hasCompanyUpdates) {
        console.log("Dispatching company details update");
        apiCalls.push(
          dispatch(
            updateCompanyDetails({
              companyName: dataToSend.companyName,
              businessType: dataToSend.businessType,
              phone: dataToSend.phone,
              address: dataToSend.address,
              website: dataToSend.website || "",
            })
          ).unwrap()
        );
      }

      // 2. Update Location & Amenities (if changed)
      const hasLocationUpdates =
        (pendingUpdates.location || pendingUpdates.amenities) &&
        dataToSend.location;

      if (hasLocationUpdates) {
        console.log("Dispatching location amenities update");
        apiCalls.push(
          dispatch(
            updateLocationAmenities({
              latitude: dataToSend.location?.latitude || 0,
              longitude: dataToSend.location?.longitude || 0,
              amenities: dataToSend.amenities,
            })
          ).unwrap()
        );
      }

      // 3. Update Bank Info (if changed) - YOU NEED TO CREATE THIS ACTION
      if (pendingUpdates.bankInfo) {
        console.log("Bank info updates detected (not implemented)");
        // apiCalls.push(dispatch(updateBankInfo(dataToSend.bankInfo)).unwrap());
      }

      // 4. Upload Images (if changed) - YOU NEED TO CREATE THESE ACTIONS
      if (coverImageFile) {
        console.log("Cover image update detected (not implemented)");
        // apiCalls.push(dispatch(uploadCoverImage(coverImageFile)).unwrap());
      }

      if (profileImageFile) {
        console.log("Profile image update detected (not implemented)");
        // apiCalls.push(dispatch(uploadProfileImage(profileImageFile)).unwrap());
      }

      // 5. Update Password (if changed) - USE THE METHOD FROM YOUR HOOK
      if (dataToSend.password) {
        console.log("Dispatching password change");
        // Use the changePassword method from useReduxProfile hook
        apiCalls.push(
          changePassword({
            currentPassword: dataToSend.password.currentPassword,
            newPassword: dataToSend.password.newPassword,
            confirmPassword: "",
          }).unwrap()
        );
      }

      // Execute all API calls
      if (apiCalls.length > 0) {
        console.log(`Executing ${apiCalls.length} API calls`);
        await Promise.all(apiCalls);

        // Reset pending changes after successful save
        setPendingUpdates({});
        setCoverImageFile(null);
        setProfileImageFile(null);
        setHasUnsavedChanges(false);

        toast.success("All changes saved successfully!");
      } else {
        console.log("No API calls to execute");
        toast.info("No changes to save");
      }
    } catch (error: unknown) {
      console.error("Failed to save changes:", error);

      // Handle the error properly
      if (error instanceof Error) {
        toast.error(`Failed to save changes: ${error.message}`);
      } else {
        toast.error("Failed to save changes");
      }
    }
  };

  const handleCancelChanges = () => {
    // Reset all pending changes
    setPendingUpdates({});
    setCoverImageFile(null);
    setProfileImageFile(null);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Reset images to original state
    if (businessProfile) {
      // You might want to reload the original images here
      setCoverImage(null);
      setProfileImage(null);
    }

    setHasUnsavedChanges(false);
    toast.info("Changes cancelled");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getStatusBadge = () => {
    if (!businessProfile) return null;

    const statusConfig = {
      PENDING: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: {
        label: "Approved",
        className: "bg-green-100 text-green-800",
      },
      REJECTED: {
        label: "Rejected",
        className: "bg-red-100 text-red-800",
      },
    };

    const config = statusConfig[businessProfile.status] || statusConfig.PENDING;

    return (
      <Badge
        className={`inline-flex items-center px-2 py-1 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-800 font-medium">
                    You have unsaved changes
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelChanges}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAllChanges}
                    disabled={updating}
                    className="bg-[#5014D0] hover:bg-[#3f10a8]"
                  >
                    {updating ? "Saving..." : "Save All Changes"}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                    src={coverImage || ""}
                    alt={
                      (businessProfile?.companyName || "Business") +
                      " cover image"
                    }
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
                      src={profileImage || ""}
                      alt={
                        (businessProfile?.companyName || "Business") +
                        " profile image"
                      }
                      onImageChange={handleProfileImageChange}
                      onImageRemove={handleProfileImageRemove}
                      editable={true}
                      size="lg"
                      fallback={getInitials(
                        businessProfile?.companyName || "Business"
                      )}
                      className="border-2 border-background -mt-18"
                    />

                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-2xl font-bold">
                          {businessProfile?.companyName || "Business Name"}
                        </CardTitle>
                        {getStatusBadge()}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {/* Business Description */}
                        <p className="text-muted-foreground text-md">
                          {businessProfile?.businessType
                            ? `${
                                businessProfile.businessType
                                  .charAt(0)
                                  .toUpperCase() +
                                businessProfile.businessType.slice(1)
                              } business`
                            : "Business description"}
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
                        value={userProfile?.email || "No email"}
                        isEditable={false}
                        onSave={(value) => handleSave("email", value)}
                      />
                      <ProfileInput
                        icon={Phone}
                        label="PHONE"
                        value={businessProfile?.phone || "No phone number"}
                        isEditable={false}
                        onSave={(value) => handleSave("phone", value)}
                      />
                      <ProfileInput
                        icon={MapPin}
                        label="ADDRESS"
                        value={businessProfile?.address || "No address"}
                        isEditable={false}
                        onSave={(value) => handleSave("address", value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <ProfileInput
                        icon={Globe}
                        label="WEBSITE"
                        value={businessProfile?.website || "No website"}
                        isEditable={true}
                        onSave={(value) => handleSave("website", value)}
                      />
                      <ProfileInput
                        icon={Calendar}
                        label="JOINED"
                        value={
                          userProfile?.createdAt
                            ? new Date(
                                userProfile.createdAt
                              ).toLocaleDateString()
                            : "Unknown"
                        }
                        isEditable={false}
                      />
                      <ProfileInput
                        icon={Tag}
                        label="BUSINESS TYPE"
                        value={
                          businessProfile?.businessType
                            ? businessProfile.businessType
                                .charAt(0)
                                .toUpperCase() +
                              businessProfile.businessType.slice(1)
                            : "Not specified"
                        }
                        isEditable={false}
                      />
                    </div>

                    <div className="space-y-4">
                      <ProfileInput
                        icon={Building}
                        label="ACCOUNT NAME"
                        value={
                          businessProfile?.bankInfo?.accountName ||
                          "Not provided"
                        }
                        isEditable={true}
                        onSave={(value) => handleSave("accountName", value)}
                      />
                      <div className="space-y-4">
                        <ProfileInput
                          icon={Captions}
                          label="ACCOUNT NUMBER"
                          value={
                            businessProfile?.bankInfo?.accountNumber ||
                            "Not provided"
                          }
                          isEditable={true}
                          onSave={(value) => handleSave("accountNumber", value)}
                        />
                        <ProfileInput
                          icon={CreditCard}
                          label="BANK NAME"
                          value={
                            businessProfile?.bankInfo?.bankName ||
                            "Not provided"
                          }
                          isEditable={true}
                          onSave={(value) => handleSave("bankName", value)}
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
                      onChange={handleServicesUpdate}
                      buttonLabel="Add Amenity"
                      placeholder="Add a service or amenity"
                      suggestions={[
                        "WiFi",
                        "Parking",
                        "Air Conditioning",
                        "Sound System",
                        "Lighting",
                        "Security",
                        "Catering",
                        "Bar Service",
                        "Outdoor Space",
                        "VIP Section",
                      ]}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <LocationVerification
                      businessLocation={
                        businessProfile?.latitude && businessProfile?.longitude
                          ? {
                              latitude: businessProfile.latitude,
                              longitude: businessProfile.longitude,
                            }
                          : undefined
                      }
                      onLocationVerified={handleLocationVerified}
                      verificationThreshold={50}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-row gap-4">
                    <Button
                      variant={"outline"}
                      className="w-full flex-1 h-12 text-md"
                      onClick={handleCancelChanges}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="w-full flex-1 h-12 text-md bg-[#5014D0]"
                      onClick={handleSaveAllChanges}
                      disabled={!hasUnsavedChanges || updating}
                    >
                      {updating ? "Saving..." : "Save All Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passwords" className="mt-4">
              <Card className="p-6 w-full">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    Change Your Password
                  </CardTitle>
                  <CardDescription className="text-md">
                    For security reasons, please ensure your password is strong
                    and unique.
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
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
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
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
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
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Action Buttons with proper spacing */}
                  <div className="flex gap-6 pt-6">
                    <Button
                      type="button"
                      onClick={handlePasswordChange}
                      disabled={
                        updating ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword
                      }
                      className="h-12 text-md px-8 bg-[#5014D0] hover:bg-[#3f10a8] text-white flex-1"
                    >
                      {updating ? "Updating..." : "Update Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
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
