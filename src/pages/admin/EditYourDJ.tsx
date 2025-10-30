import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageUploadField } from "@/components/image-upload-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useReduxDJProfile } from "@/hooks/useReduxDJProfile";
// import { useReduxAuth } from "@/hooks/UseReduxAuth";
import type { UpdateDJProfileData } from "@/redux/slices/djProfileSlice";

interface FormData {
  fullName: string;
  username: string;
  genre: string;
  profileImage: string | null;
  backgroundImage: string | null;

  // Social profiles as individual fields for better UX
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  soundcloud?: string;
  mixcloud?: string;
  youtube?: string;
  spotify?: string;

  // Bio is required by API but we'll set it to empty
  bio?: string;
}

export function EditYourDJPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    getDJById, 
    updateDJ, 
    updating, 
    clearAllErrors, 
    currentDJ,
    getAllDJs 
  } = useReduxDJProfile();
  // const { user } = useReduxAuth();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    genre: "",
    profileImage: null,
    backgroundImage: null,
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    soundcloud: "",
    mixcloud: "",
    youtube: "",
    spotify: "",
    bio: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Clear errors when component mounts
  useEffect(() => {
    clearAllErrors();
  }, [clearAllErrors]);

  // Load profile data when component mounts or ID changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          await getDJById(id);
        } catch (error) {
          console.error("Failed to load DJ profile:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProfileData();
  }, [id, getDJById]);

  // Update form data when currentDJ changes
  useEffect(() => {
    if (currentDJ) {
      // Extract social profiles from the socials array
      const socials = currentDJ.socials || [];
      const socialProfiles = socials.reduce((acc, social) => {
        acc[social.platform] = social.url;
        return acc;
      }, {} as Record<string, string>);

      setFormData({
        fullName: currentDJ.fullName || "",
        username: currentDJ.djUsername || "",
        genre: currentDJ.genre || "",
        profileImage: currentDJ.profileImageUrl || null,
        backgroundImage: currentDJ.backgroundImageUrl || null,
        website: socialProfiles.website || "",
        instagram: socialProfiles.instagram || "",
        facebook: socialProfiles.facebook || "",
        twitter: socialProfiles.twitter || "",
        soundcloud: socialProfiles.soundcloud || "",
        mixcloud: socialProfiles.mixcloud || "",
        youtube: socialProfiles.youtube || "",
        spotify: socialProfiles.spotify || "",
        bio: currentDJ.bio || "",
      });
    }
  }, [currentDJ]);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
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

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.genre.trim()) {
      errors.genre = "Genre is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Prepare socials array for API
  const prepareSocials = () => {
    const socials = [];

    if (formData.website)
      socials.push({ platform: "website", url: formData.website });
    if (formData.instagram)
      socials.push({ platform: "instagram", url: formData.instagram });
    if (formData.facebook)
      socials.push({ platform: "facebook", url: formData.facebook });
    if (formData.twitter)
      socials.push({ platform: "twitter", url: formData.twitter });
    if (formData.soundcloud)
      socials.push({ platform: "soundcloud", url: formData.soundcloud });
    if (formData.mixcloud)
      socials.push({ platform: "mixcloud", url: formData.mixcloud });
    if (formData.youtube)
      socials.push({ platform: "youtube", url: formData.youtube });
    if (formData.spotify)
      socials.push({ platform: "spotify", url: formData.spotify });

    return socials;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted for editing");

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    if (!id) {
      console.error("No DJ ID provided");
      return;
    }

    try {
      console.log("Updating DJ profile...");

      const profileData: UpdateDJProfileData = {
        fullName: formData.fullName.trim(),
        djUsername: formData.username.trim(),
        genre: formData.genre,
        bio: formData.bio || "",
        socials: prepareSocials(),
        profileImageUrl: formData.profileImage || undefined,
        backgroundImageUrl: formData.backgroundImage || undefined,
      };

      console.log("Profile data being sent for update:", profileData);

      const result = await updateDJ(id, profileData).unwrap();

      console.log("DJ profile updated successfully:", result);

      // Refresh the DJs list and navigate back
      await getAllDJs();
      navigate("/admin/find-your-dj");
    } catch (error: any) {
      console.error("Failed to update DJ profile:", error);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const isFormSubmittable =
    formData.fullName.trim() !== "" &&
    formData.username.trim() !== "" &&
    formData.genre.trim() !== "";


  if (!currentDJ && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">DJ Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The DJ profile you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/find-your-dj")}>
            Back to DJ List
          </Button>
        </div>
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
                onClick={handleClose}
                disabled={updating}
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
            {/* Basic Information Card */}
            <Card className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <CardTitle className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  DJ Profile Information
                </h2>
              </CardTitle>

              <div className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="flex-1 h-11"
                    required
                    disabled={updating}
                  />
                  {formErrors.fullName && (
                    <p className="text-sm text-red-600">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* DJ Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    DJ Username *
                  </Label>
                  <Input
                    id="username"
                    placeholder="dj_johndoe"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="flex-1 h-11"
                    required
                    disabled={updating}
                  />
                  {formErrors.username && (
                    <p className="text-sm text-red-600">
                      {formErrors.username}
                    </p>
                  )}
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-sm font-medium">
                    Genre *
                  </Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => handleInputChange("genre", value)}
                    disabled={updating}
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
                      <SelectItem value="electronic">
                        Electronic Dance Music
                      </SelectItem>
                      <SelectItem value="deep-house">Deep House</SelectItem>
                      <SelectItem value="tech-house">Tech House</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.genre && (
                    <p className="text-sm text-red-600">{formErrors.genre}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    placeholder="Tell us about the DJ..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="h-11"
                    disabled={updating}
                  />
                </div>
              </div>
            </Card>

            {/* Social Profiles Card */}
            <Card className="space-y-6 bg-card p-6">
              <CardTitle>
                <h2 className="text-xl font-semibold text-foreground">
                  Social Profiles
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Add links to the DJ's social media profiles
                </p>
              </CardTitle>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://djwebsite.com"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm font-medium">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/djusername"
                    value={formData.instagram}
                    onChange={(e) =>
                      handleInputChange("instagram", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook" className="text-sm font-medium">
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/djusername"
                    value={formData.facebook}
                    onChange={(e) =>
                      handleInputChange("facebook", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm font-medium">
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/djusername"
                    value={formData.twitter}
                    onChange={(e) =>
                      handleInputChange("twitter", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soundcloud" className="text-sm font-medium">
                    SoundCloud
                  </Label>
                  <Input
                    id="soundcloud"
                    type="url"
                    placeholder="https://soundcloud.com/djusername"
                    value={formData.soundcloud}
                    onChange={(e) =>
                      handleInputChange("soundcloud", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixcloud" className="text-sm font-medium">
                    Mixcloud
                  </Label>
                  <Input
                    id="mixcloud"
                    type="url"
                    placeholder="https://mixcloud.com/djusername"
                    value={formData.mixcloud}
                    onChange={(e) =>
                      handleInputChange("mixcloud", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-sm font-medium">
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/c/djusername"
                    value={formData.youtube}
                    onChange={(e) =>
                      handleInputChange("youtube", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spotify" className="text-sm font-medium">
                    Spotify
                  </Label>
                  <Input
                    id="spotify"
                    type="url"
                    placeholder="https://open.spotify.com/artist/djusername"
                    value={formData.spotify}
                    onChange={(e) =>
                      handleInputChange("spotify", e.target.value)
                    }
                    className="h-11"
                    disabled={updating}
                  />
                </div>
              </div>
            </Card>

            {/* Images Section */}
            <Card className="space-y-6 bg-card p-6">
              <CardTitle>
                <h2 className="text-xl font-semibold text-foreground">
                  Profile Images
                </h2>
              </CardTitle>

              <div className="grid grid-cols-2 gap-6">
                {/* Profile Image */}
                <ImageUploadField
                  label="Profile Image"
                  description="Profile image. Recommended size: 400x400px. JPG, PNG, or WebP, Max 10MB."
                  recommendedSize="400×400px"
                  formats="JPG, PNG, WebP"
                  maxSize={10}
                  existingImageUrl={formData.profileImage}
                  onImageUpload={handleProfileImageChange}
                />

                {/* Background Image */}
                <ImageUploadField
                  label="Background Image"
                  description="Background image for DJ Profile. Recommended size: 1200x600px. JPG, PNG, or WebP, Max 10MB."
                  recommendedSize="1200×600px"
                  formats="JPG, PNG, WebP"
                  maxSize={10}
                  existingImageUrl={formData.backgroundImage}
                  onImageUpload={handleBackgroundImageChange}
                />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-[#5014D0] hover:bg-[#4512B8] h-11 flex-1 text-white"
                disabled={!isFormSubmittable || updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updating}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}