import { ProfileImageComponent } from "@/components/profile-image";
import { ProfileInput } from "@/components/profile-input";
import { ProfileSelect } from "@/components/profile-select";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReduxProfile } from "@/hooks/useReduxProfile";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type SettingsTab = "personal" | "password" | "department";

// Simplified interface for user profile updates
interface UserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  primaryRole?: string;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("personal");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Simplified state for user profile updates
  const [pendingUpdates, setPendingUpdates] = useState<
    Partial<UserProfileData>
  >({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { userProfile, updating, changePassword } = useReduxProfile();

  // Add missing function implementations
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleProfileImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageRemove = () => {
    setProfileImage(null);
    setHasUnsavedChanges(true);
  };

  const handleCancelChanges = () => {
    setPendingUpdates({});
    setHasUnsavedChanges(false);
    toast.info("Changes cancelled");
  };

  const handleSaveAllChanges = async () => {
    if (Object.keys(pendingUpdates).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      // Implement your save logic here
      console.log("Saving all changes:", pendingUpdates);

      // Reset states after successful save
      setPendingUpdates({});
      setHasUnsavedChanges(false);
      toast.success("All changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  // Simplified handleSave function for user profile fields only
  const handleSave = async (field: string, value: string) => {
    console.log(`Saving ${field}:`, value);

    try {
      const updates: Partial<UserProfileData> = {};

      switch (field) {
        case "firstName":
          updates.firstName = value;
          break;
        case "lastName":
          updates.lastName = value;
          break;
        case "email":
          updates.email = value;
          break;
        case "phone":
          updates.phone = value;
          break;
        case "department":
          updates.department = value;
          break;
        case "primaryRole":
          updates.primaryRole = value;
          break;
        default:
          break;
      }

      // Add to pending updates
      setPendingUpdates((prev) => ({ ...prev, ...updates }));
      setHasUnsavedChanges(true);

      toast.success(`${field} updated locally`);
    } catch (error) {
      toast.error("Failed to update profile");
    }
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
      });

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

  return (
    <div className="min-h-screen">
      <SiteHeader label="Settings" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <Card>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as SettingsTab)}
              className="px-6 w-full bg-transparent rounded-none"
            >
              <TabsList className="grid w-full max-w-full grid-cols-3 rounded-none p-0 bg-transparent border-b mb-2">
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                  value="personal"
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                  value="password"
                >
                  Password
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                  value="department"
                >
                  Department Access
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-0">
                <Card className="overflow-hidden border-0 px-0">
                  <CardHeader className="relative">
                    {/* Profile Image positioned over the cover image */}
                    <div className="mb-5">
                      <CardTitle className="text-md mb-1">
                        Personal Information
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    <Separator />

                    <div className="flex flex-col sm:flex-row items-start sm:items-start gap-6">
                      <ProfileImageComponent
                        src={profileImage || ""}
                        alt={`${
                          userProfile?.firstName || "User"
                        } profile image`}
                        onImageChange={handleProfileImageChange}
                        onImageRemove={handleProfileImageRemove}
                        editable={true}
                        size="lg"
                        fallback={getInitials(
                          `${userProfile?.firstName || ""} ${
                            userProfile?.lastName || ""
                          }`.trim() || "User"
                        )}
                        className="border-2 border-muted mt-4"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Separator />

                    {/* Contact Information - Fixed grid structure */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <ProfileInput
                          label="First Name"
                          value={userProfile?.firstName || "No first name"}
                          isEditable={true}
                          onSave={(value) => handleSave("firstName", value)}
                        />
                        <ProfileInput
                          label="Email"
                          value={userProfile?.email || "No email"}
                          isEditable={true}
                          onSave={(value) => handleSave("email", value)}
                        />

                        <div>
                          <ProfileSelect
                            label="Department"
                            value={userProfile?.department || ""}
                            options={[
                              { value: "marketing", label: "Marketing" },
                              { value: "sales", label: "Sales" },
                              { value: "engineering", label: "Engineering" },
                              { value: "hr", label: "Human Resources" },
                              { value: "finance", label: "Finance" },
                              { value: "operations", label: "Operations" },
                            ]}
                            isEditable={false}
                            onSave={(value) => handleSave("department", value)}
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <ProfileInput
                          label="Last Name"
                          value={userProfile?.lastName || "No last name"}
                          isEditable={true}
                          onSave={(value) => handleSave("lastName", value)}
                        />
                        <ProfileInput
                          label="Phone Number"
                          value={userProfile?.phone || "No phone number"}
                          isEditable={true}
                          onSave={(value) => handleSave("phone", value)}
                        />

                        <div>
                          <ProfileSelect
                            label="Primary Role"
                            value={userProfile?.primaryRole || ""}
                            options={[
                              { value: "admin", label: "Administrator" },
                              { value: "manager", label: "Manager" },
                              { value: "supervisor", label: "Supervisor" },
                              { value: "employee", label: "Employee" },
                              { value: "contributor", label: "Contributor" },
                            ]}
                            isEditable={false}
                            onSave={(value) => handleSave("primaryRole", value)}
                            
                          />
                        </div>
                      </div>
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

              <TabsContent value="password" className="mt-0">
                <Card className="w-full border-0">
                  <CardHeader>
                    <CardTitle className="text-xl mb-1">
                      Change Your Password
                    </CardTitle>
                    <CardDescription className="text-md">
                      For security reasons, please ensure your password is
                      strong and unique.
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
                          Password must be at least 8 characters long and
                          include uppercase, lowercase, and numbers.
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
                    </div>

                    <div className="rounded-md bg-muted p-8 border-1">
                      <h4 className="font-medium mb-4">
                        Password Requirements:
                      </h4>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-4 items-center">
                          <Check className="size-4" />
                          <p className="text-sm">At least 8 characters long</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                          <Check className="size-4" />
                          <p className="text-sm">Contains uppercase letter</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                          <Check className="size-4" />
                          <p className="text-sm">Contains lowercase letter</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                          <Check className="size-4" />
                          <p className="text-sm">Contains number</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                          <Check className="size-4" />
                          <p className="text-sm">Contains special character</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="department" className="mt-0">
                {/* Add department access content here */}
                <Card className="w-full border-0">
                  <CardHeader>
                    <CardTitle className="text-xl mb-1">
                      Department Access
                    </CardTitle>
                    <CardDescription className="text-md">
                      Manage your department permissions and access levels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Department access management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
