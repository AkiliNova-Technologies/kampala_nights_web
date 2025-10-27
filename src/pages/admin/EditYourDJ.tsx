import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageUploadField } from "@/components/image-upload-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDJProfiles } from "@/hooks/useDJProfiles";
import { useEffect, useState } from "react";

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
  location: string;
}

export function EditYourDJPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProfileById, updateProfile } = useDJProfiles();
  
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
    location: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load profile data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      const profile = getProfileById(id);
      if (profile) {
        setFormData({
          fullName: profile.name,
          username: profile.username,
          genre: profile.genre,
          status: profile.status,
          socialProfiles: Object.values(profile.socialProfiles || {}).join(", "),
          bio: profile.bio || "",
          profileImage: profile.profileImage || null,
          backgroundImage: profile.backgroundImage || null,
          playingTonight: "",
          location: profile.location,
        });
      }
      setIsLoading(false);
    }
  }, [id]);

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
    if (id && isFormSubmittable) {
      // Convert social profiles string back to object
      const socialProfilesObj: Record<string, string> = {};
      if (formData.socialProfiles) {
        formData.socialProfiles.split(",").forEach(link => {
          const trimmedLink = link.trim();
          if (trimmedLink) {
            // Extract platform from URL or use generic key
            if (trimmedLink.includes('instagram')) {
              socialProfilesObj.instagram = trimmedLink;
            } else if (trimmedLink.includes('soundcloud')) {
              socialProfilesObj.soundcloud = trimmedLink;
            } else if (trimmedLink.includes('facebook')) {
              socialProfilesObj.facebook = trimmedLink;
            } else if (trimmedLink.includes('twitter')) {
              socialProfilesObj.twitter = trimmedLink;
            } else if (trimmedLink.includes('youtube')) {
              socialProfilesObj.youtube = trimmedLink;
            } else if (trimmedLink.includes('spotify')) {
              socialProfilesObj.spotify = trimmedLink;
            } else if (trimmedLink.includes('mixcloud')) {
              socialProfilesObj.mixcloud = trimmedLink;
            }
          }
        });
      }

      // Update the profile
      updateProfile(id, {
        name: formData.fullName,
        username: formData.username,
        genre: formData.genre,
        status: formData.status as "active" | "disabled" | "draft",
        socialProfiles: socialProfilesObj,
        bio: formData.bio,
        profileImage: formData.profileImage || undefined,
        backgroundImage: formData.backgroundImage || undefined,
        location: formData.location,
      });

      // Navigate back to the DJ list
      navigate("/admin/find-your-dj");
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const isFormSubmittable =
    formData.fullName.trim() !== "" &&
    formData.username.trim() !== "" &&
    formData.genre.trim() !== "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

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
                <p className="font-semibold">Edit DJ Profile</p>
                <p className="text-sm text-muted-foreground">
                  Update DJ profile information
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                form="edit-dj-form"
                className="bg-[#5014D0] hover:bg-[#4512B8] h-11 flex-1 text-white"
                disabled={!isFormSubmittable}
              >
                Save Changes
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
          <form id="edit-dj-form" onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
            <Card className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <CardTitle className="mb-2">
                <h2 className="text-xl font-semibold text-foreground">
                  DJ Profile
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
                      placeholder="John Seggawa"
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
                    DJ Username
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

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="location"
                      placeholder="Kampala"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
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
                      <SelectItem value="hip hop">Hip Hop</SelectItem>
                      <SelectItem value="r&b">R&B</SelectItem>
                      <SelectItem value="afrobeats">Afrobeats</SelectItem>
                      <SelectItem value="deep house">Deep House</SelectItem>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
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
                  type="text"
                  placeholder="Insert social media links separated by commas"
                  value={formData.socialProfiles}
                  onChange={(e) =>
                    handleInputChange("socialProfiles", e.target.value)
                  }
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">
                  Enter social media URLs separated by commas (e.g., instagram.com/username, soundcloud.com/username)
                </p>
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
                  Images
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
                  existingImageUrl={formData.profileImage}
                  onImageUpload={handleProfileImageChange}
                />

                {/* Background Image */}
                <ImageUploadField
                  label="Background Image"
                  description="Background image for DJ Profile. Recommended size: 400x300px. Supports JPG, PNG, WebP formats."
                  recommendedSize="400×300px"
                  formats="JPEG, PNG, WebP"
                  maxSize={10}
                  existingImageUrl={formData.backgroundImage}
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
          </form>
        </div>
      </main>
    </div>
  );
}