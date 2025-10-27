import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUploadField } from "@/components/image-upload-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  fullName: string;
  username: string;
  genre: string;
  status: string;
  socialProfiles: string;
  bio: string;
  profileImage: string | null;
  backgroundImage: string | null;
  playingTonight: string;
}

export function AddYourDJPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    genre: "",
    status: "",
    socialProfiles: "",
    bio: "",
    profileImage: null,
    backgroundImage: null,
    playingTonight: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));
  };

  const handleBackgroundImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      backgroundImage: imageUrl,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("DJ Profile data:", formData);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const isFormSubmittable =
    formData.fullName.trim() !== "" &&
    formData.username.trim() !== "" &&
    formData.genre.trim() !== "";

  return (
    <div className="min-h-screen">
      <SiteHeader label="DJ Management" />
      <main className="flex-1">
        <div className="space-y-6">
          <div className="flex items-center px-6 pt-6 justify-between">
            <div className="flex flex-row gap-5 items-center">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => navigate(-1)}
              >
                <ArrowLeft />
              </Button>
              <div>
                <p className="font-semibold">Add your DJ</p>
                <p className="text-sm text-muted-foreground">
                  Create a DJ profile
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#5014D0] hover:bg-[#4512B8] h-11 flex-1 text-white"
                disabled={!isFormSubmittable}
              >
                Save Details
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
            <Card className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <CardTitle className="mb-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Dj Profile
                </h2>
              </CardTitle>

              {/* Full Name */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full name
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="fullName"
                      placeholder="@johndoe"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="flex-1 h-11"
                      required
                    />
                  </div>
                </div>

                {/* DJ Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Dj Username
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="username"
                      placeholder="@username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="flex-1 h-11"
                      required
                    />
                  </div>
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-sm font-medium">
                    Genre
                  </Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => handleInputChange("genre", value)}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amapiano">Amapiano</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="techno">Techno</SelectItem>
                      <SelectItem value="hiphop">Hip Hop</SelectItem>
                      <SelectItem value="rnb">R&B</SelectItem>
                      <SelectItem value="afrobeats">Afrobeats</SelectItem>
                      <SelectItem value="dancehall">Dancehall</SelectItem>
                      <SelectItem value="reggae">Reggae</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue placeholder="Set the status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="space-y-2">
                <Label htmlFor="socialProfiles" className="text-sm font-medium">
                  Social Profiles
                </Label>
                <Input
                  id="socialProfiles"
                  type="url"
                  placeholder="Insert a link"
                  value={formData.socialProfiles}
                  onChange={(e) =>
                    handleInputChange("socialProfiles", e.target.value)
                  }
                  className="h-11"
                />
              </div>

              {/* DJ Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  DJ Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Add a short biography of the DJ"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </Card>

            {/* Add Images Section */}
            <Card className="space-y-6 bg-card p-6">
              <CardTitle className="mb-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Add images
                </h2>
              </CardTitle>

              <div className="grid grid-cols-2 gap-6">
                {/* Profile Image */}
                <ImageUploadField
                  label="Profile Image"
                  description="Profile image. Recommended size: 1920x1080px. JEPG OR PNG,  Max 10MB. Used for event banners and hero sections."
                  recommendedSize="1920×1080px"
                  formats="JPEG or PNG"
                  maxSize={10}
                  onImageUpload={handleProfileImageChange}
                />

                {/* Background Image */}
                <ImageUploadField
                  label="Background Image"
                  description="Background image for DJ Profile. Recommended size: 400x300px. Supports JPG, PNG, WebP formats."
                  recommendedSize="400×300px"
                  formats="JPEG, PNG, WebP"
                  maxSize={10}
                  onImageUpload={handleBackgroundImageChange}
                />
              </div>
            </Card>

            {/* Where they are playing tonight */}
            <Card className="space-y-2 p-6">
              <CardTitle>
                <h2 className="text-xl font-semibold text-foreground">
                  Add where they are playing tonight
                </h2>
              </CardTitle>

              <ImageUploadField
                label="Event Poster"
                description="Event Poster for DJ Profile. Recommended size: 400×300px. Supports JPEG, PNG, WebP formats."
                recommendedSize="400×300px"
                formats="JPEG, PNG, WebP"
                maxSize={10}
                onImageUpload={handleBackgroundImageChange}
              />
            </Card>

            {/* Actions */}
            {/* <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5014D0] hover:bg-[#4512B8] h-11 flex-1 text-white"
                disabled={!isFormSubmittable}
              >
                Save Details
              </Button>
            </div> */}
          </form>
        </div>
      </main>
    </div>
  );
}
