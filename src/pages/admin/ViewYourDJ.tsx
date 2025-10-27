import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { ArrowLeft, Pencil, Calendar, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDJProfiles } from "@/hooks/useDJProfiles";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import type { Profile } from "@/types/profile";
import { getSocialIcon } from "@/utils/social-icons";

export function ViewYourDJPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProfileById } = useDJProfiles();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (id) {
      const foundProfile = getProfileById(id);
      setProfile(foundProfile || null);
    }
  }, [id, getProfileById]);

  const getStatusConfig = (status: string) => {
    const config = {
      active: {
        label: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      disabled: {
        label: "Disabled",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      draft: {
        label: "Draft",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    };
    return config[status as keyof typeof config] || config.active;
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const renderSocialIconsView = () => {
    if (!profile?.socialProfiles) {
      return (
        <span className="text-sm text-muted-foreground">
          No social profiles available
        </span>
      );
    }

    let socialLinks: { platform: string; url: string }[] = [];

    if (typeof profile.socialProfiles === "string") {
      socialLinks = [{ platform: "main", url: profile.socialProfiles }];
    } else if (typeof profile.socialProfiles === "object") {
      socialLinks = Object.entries(profile.socialProfiles)
        .filter(([_, url]) => url && url.trim() !== "")
        .map(([platform, url]) => ({ platform, url: url as string }));
    }

    if (socialLinks.length === 0) {
      return (
        <span className="text-sm text-muted-foreground">
          No social profiles available
        </span>
      );
    }

    return (
      <div className="flex gap-3">
        {socialLinks.map(({ platform, url }, index) => (
          <a
            key={`${platform}-${index}`}
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors group"
            title={`${platform}: ${url}`}
          >
            {getSocialIcon(platform, url)}
            <span className="sr-only">{platform}</span>
          </a>
        ))}
      </div>
    );
  };

  // Render image gallery for playing tonight
  const renderPlayingTonight = () => {
    if (!profile?.playingTonight || profile.playingTonight.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No events scheduled for tonight</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.playingTonight.map((imageUrl, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={`Tonight's event ${index + 1}`}
              className="w-full h-78 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Tonight
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render image gallery for past events
  const renderPastEvents = () => {
    if (!profile?.pastEventListings || profile.pastEventListings.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No past events available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.pastEventListings.map((imageUrl, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={`Past event ${index + 1}`}
              className="w-full h-120 object-cover transition-transform group-hover:scale-105"
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" /> */}
          </div>
        ))}
      </div>
    );
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">DJ Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The DJ profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/find-your-dj")}>
            Back to DJ Profiles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader label="Find Your DJ Management" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                className="p-2 bg-background dark:bg-card"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">DJ Profile</h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive DJ details
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate(`/admin/find-your-dj/${profile.id}/edit`)}
              className="h-11 bg-[#5014D0] hover:bg-[#5014D0]/90"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Left Column - Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <Card className="p-0 overflow-hidden">
                <div className="relative">
                  <Image
                    src={profile.backgroundImage || "/placeholder-event.jpg"}
                    alt="DJ Background"
                    className="w-full h-68 object-cover"
                  />
                </div>

                <div className="pb-6 px-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-6 mb-4">
                      <div>
                        <Avatar className="h-34 w-34 border-4 border-background -mt-20">
                          <AvatarImage
                            src={profile.profileImage}
                            alt={profile.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="flex flex-row items-center gap-4 mb-3">
                          <h2 className="text-2xl font-bold">{profile.name}</h2>
                          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                          <p className="text-muted-foreground">
                            {profile.username}
                          </p>
                          <Badge
                            className={getStatusConfig(profile.status).color}
                          >
                            {getStatusConfig(profile.status).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSocialIconsView()}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Playing Tonight Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Playing Tonight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderPlayingTonight()}
                </CardContent>
              </Card>

              {/* Past Event Listings Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Past Event Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderPastEvents()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}