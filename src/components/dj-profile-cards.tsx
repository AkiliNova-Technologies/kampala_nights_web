import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  EllipsisVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Image } from "./ui/image";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Music2,
  Link,
  Globe,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DeleteDialog } from "./delete-dialog";

interface DJProfileCardsProps {
  profiles: Profile[];
  layout?: "grid" | "list";
  onLayoutChange?: (layout: "grid" | "list") => void;
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: string) => void;
  onCategoryFilter?: (category: string) => void;
  onEditProfile?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  onDeleteProfile?: (profile: Profile) => void;
  searchValue?: string;
  selectedStatus?: string;
  selectedCategory?: string;
  className?: string;
}

const DJProfileCards: React.FC<DJProfileCardsProps> = ({
  profiles = [],
  layout = "grid",
  onLayoutChange,
  onEditProfile,
  onViewProfile,
  onDeleteProfile,
  searchValue = "",
  selectedStatus = "all",
  selectedCategory = "all",
  className,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedProfile, setSelectedProfile] = React.useState<Profile | null>(
    null
  );
  const itemsPerPage = 6;

  // Pagination
  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProfiles = profiles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [profiles.length, selectedStatus, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle edit profile
  const handleEditProfile = (profile: Profile) => {
    if (onEditProfile) {
      onEditProfile(profile);
    } else {
      // Default behavior - navigate to edit page
      console.log(`Navigating to edit page for profile: ${profile.id}`);
    }
  };

  // Handle view profile
  const handleViewProfile = (profile: Profile) => {
    if (onViewProfile) {
      onViewProfile(profile);
    } else {
      // Default behavior - navigate to view page
      console.log(`Navigating to view page for profile: ${profile.id}`);
    }
  };

  // Handle delete profile confirmation
  const handleDeleteProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion after confirmation
  const handleConfirmDelete = () => {
    if (selectedProfile && onDeleteProfile) {
      onDeleteProfile(selectedProfile);
    }
    setDeleteDialogOpen(false);
    setSelectedProfile(null);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Table fields configuration for list layout
  const profileFields = [
    {
      key: "name",
      header: "Full name",
      enableHiding: false,
      cell: (value: unknown, row: Profile) => (
        <div className="flex items-center gap-6">
          <Avatar className="h-13 w-13">
            <AvatarImage src={row.profileImage} alt={row.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-medium text-sm">{String(value)}</span>
            <span className="text-xs text-muted-foreground">
              {row.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "genre",
      header: "Genre",
      cell: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "socialProfiles",
      header: "Social Profiles",
      cell: (_: unknown, row: Profile) => {
        const renderSocialIcons = () => {
          if (!row.socialProfiles) {
            return (
              <span className="text-xs text-muted-foreground">
                No social profiles
              </span>
            );
          }

          let socialLinks: { platform: string; url: string }[] = [];

          if (typeof row.socialProfiles === "string") {
            socialLinks = [{ platform: "main", url: row.socialProfiles }];
          } else if (typeof row.socialProfiles === "object") {
            socialLinks = Object.entries(row.socialProfiles)
              .filter(([_, url]) => url && url.trim() !== "")
              .map(([platform, url]) => ({ platform, url: url as string }));
          }

          if (socialLinks.length === 0) {
            return (
              <span className="text-xs text-muted-foreground">
                No social profiles
              </span>
            );
          }

          return (
            <div className="flex gap-2">
              {socialLinks.slice(0, 3).map(({ platform, url }, index) => (
                <a
                  key={`${platform}-${index}`}
                  href={url.startsWith("http") ? url : `https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title={`${platform}: ${url}`}
                >
                  {getSocialIcon(platform, url)}
                </a>
              ))}
              {socialLinks.length > 3 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs text-muted-foreground">
                  +{socialLinks.length - 3}
                </div>
              )}
            </div>
          );
        };

        return renderSocialIcons();
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (value: unknown) => {
        const status = value as string;
        const statusConfig = {
          active: {
            label: "Active",
            dotColor: "bg-green-500",
            textColor: "text-green-700",
            bgColor: "bg-green-50",
          },
          disabled: {
            label: "Disabled",
            dotColor: "bg-red-500",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
          },
          draft: {
            label: "Draft",
            dotColor: "bg-yellow-500",
            textColor: "text-yellow-700",
            bgColor: "bg-yellow-50",
          },
        };

        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.active;

        return (
          <Badge
            variant="secondary"
            className={`flex flex-row items-center w-20 gap-2 ${config.bgColor} ${config.textColor}`}
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center" as const,
    },
  ];

  // Table actions configuration
  const profileActions = [
    {
      type: "view" as const,
      label: "View Profile",
      icon: <Eye className="size-5" />,
      onClick: (row: Profile) => handleViewProfile(row),
    },
    {
      type: "edit" as const,
      label: "Edit Profile",
      icon: <Edit className="size-5" />,
      onClick: (row: Profile) => handleEditProfile(row),
    },
    {
      type: "delete" as const,
      label: "Delete Profile",
      icon: <Trash2 className="size-5" />,
      onClick: (row: Profile) => handleDeleteProfile(row),
      className: "text-red-600 focus:text-red-600",
    },
  ];

  // Fallback state when no profiles
  if (profiles.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="size-16 bg-muted rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold text-muted-foreground">DJ</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No DJ Profiles Found</h3>
          <p className="text-muted-foreground">
            {searchValue ||
            selectedStatus !== "all" ||
            selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : "No DJ profiles available yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Filters and Layout Toggle */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Layout Toggle */}
            <div className="flex rounded-md p-1 gap-2 -mt-2">
              <Button
                variant="secondary"
                onClick={() => onLayoutChange?.("grid")}
                className={cn(
                  "p-1.5 rounded-sm transition-colors flex-row",
                  layout === "grid"
                    ? "bg-[#5041D0] text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="h-5 w-5" />
                Grid
              </Button>
              <Button
                variant="secondary"
                onClick={() => onLayoutChange?.("list")}
                className={cn(
                  "p-1.5 rounded-sm transition-colors",
                  layout === "list"
                    ? "bg-[#5041D0] text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Profiles Grid/Table */}
        {layout === "grid" ? (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProfiles.map((profile) => (
                <DJProfileCard
                  key={profile.id}
                  profile={profile}
                  layout={layout}
                  onEditProfile={handleEditProfile}
                  onViewProfile={handleViewProfile}
                  onDeleteProfile={handleDeleteProfile}
                />
              ))}
            </div>

            {/* Pagination for Grid */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-4">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Table Layout */
          <div className="min-w-full flex flex-1 relative">
            <DataTable
              data={profiles}
              fields={profileFields}
              actions={profileActions}
              enableSelection={true}
              enablePagination={true}
              pageSize={10}
              loading={false}
              onRowClick={(row) => console.log(row)}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        openDisable={deleteDialogOpen}
        onOpenDisableChange={setDeleteDialogOpen}
        profile={selectedProfile}
        onDisable={handleConfirmDelete}
        title="Delete DJ Profile"
        description="Are you sure you want to delete this DJ profile? This action cannot be undone."
      />
    </>
  );
};

// Individual Profile Card Component (for grid layout only)
interface DJProfileCardProps {
  profile: Profile;
  layout: "grid" | "list";
  onEditProfile?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  onDeleteProfile?: (profile: Profile) => void;
}

// Social icon helper function
const getSocialIcon = (platform: string, url: string) => {
  const iconProps = { className: "w-4 h-4" };

  if (platform.includes("instagram") || url.includes("instagram")) {
    return <Instagram {...iconProps} className="text-primary" />;
  }
  if (platform.includes("facebook") || url.includes("facebook")) {
    return <Facebook {...iconProps} className="text-primary" />;
  }
  if (platform.includes("twitter") || url.includes("twitter")) {
    return <Twitter {...iconProps} className="text-primary" />;
  }
  if (platform.includes("youtube") || url.includes("youtube")) {
    return <Youtube {...iconProps} className="text-primary" />;
  }
  if (platform.includes("soundcloud") || url.includes("soundcloud")) {
    return <Music2 {...iconProps} className="text-primary" />;
  }
  if (platform.includes("mixcloud") || url.includes("mixcloud")) {
    return <Music2 {...iconProps} className="text-primary" />;
  }
  if (platform.includes("spotify") || url.includes("spotify")) {
    return <Music2 {...iconProps} className="text-primary" />;
  }
  if (platform.includes("website") || url.includes("http")) {
    return <Globe {...iconProps} className="text-primary" />;
  }
  return <Link {...iconProps} className="text-primary" />;
};

const DJProfileCard: React.FC<DJProfileCardProps> = ({
  profile,
  layout,
  onEditProfile,
  onViewProfile,
  onDeleteProfile,
}) => {
  const navigate = useNavigate();
  const isGrid = layout === "grid";

  // Get status configuration
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

  // Function to render social media icons
  const renderSocialIcons = () => {
    if (!profile.socialProfiles) {
      return (
        <span className="text-xs text-muted-foreground">
          No social profiles
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
        <span className="text-xs text-muted-foreground">
          No social profiles
        </span>
      );
    }

    return (
      <div className="flex gap-2">
        {socialLinks.slice(0, 3).map(({ platform, url }, index) => (
          <a
            key={`${platform}-${index}`}
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
            title={`${platform}: ${url}`}
          >
            {getSocialIcon(platform, url)}
          </a>
        ))}
        {socialLinks.length > 3 && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs text-muted-foreground">
            +{socialLinks.length - 3}
          </div>
        )}
      </div>
    );
  };

  // Handle view profile click
  const handleViewProfile = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Stop event propagation
    if (onViewProfile) {
      onViewProfile(profile);
    } else {
      navigate(`/admin/find-your-dj/${profile.id}/view`);
    }
  };

  // Handle edit profile click
  const handleEditProfile = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Stop event propagation
    if (onEditProfile) {
      onEditProfile(profile);
    }
  };

  // Handle delete profile click
  const handleDeleteProfile = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Stop event propagation
    if (onDeleteProfile) {
      onDeleteProfile(profile);
    }
  };

  // Handle card click for grid layout
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate to view if clicking on the card itself, not buttons
    if (!(e.target as HTMLElement).closest('button, a, [role="button"]')) {
      handleViewProfile();
    }
  };

  return (
    <div
      className={cn(
        "border border-input bg-card rounded-lg overflow-hidden transition-all hover:shadow-md relative",
        isGrid ? "flex flex-col" : "flex flex-row"
      )}
      onClick={isGrid ? handleCardClick : undefined}
    >
      {/* Profile Header with Status Badge */}
      <div
        className={cn(
          "relative border-border",
          isGrid ? "" : "w-48 flex-shrink-0 flex flex-col justify-center"
        )}
      >
        {/* DJ Initial/Icon */}
        <div className="relative flex items-center">
          <Image
            src={profile.profileImage || ""}
            alt={profile.username}
            className="w-full h-70"
          />
          {/* Status Badge positioned at top right */}
          <Badge
            className={cn(
              "absolute top-3 right-3 px-2 py-1 text-xs font-medium border rounded-full",
              getStatusConfig(profile.status).color
            )}
          >
            {getStatusConfig(profile.status).label}
          </Badge>

          {/* Dropdown Menu for actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute text-muted-foreground hover:text-foreground",
                  isGrid ? "bottom-3 right-3" : "top-3 right-3"
                )}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  e.preventDefault(); // Additional prevention
                }}
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProfile(e);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProfile(e);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProfile(e);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-4">
          {/* Genre */}
          <div className="flex-1 min-w-0 flex-col flex gap-2">
            <h3 className="font-semibold text-foreground truncate">
              {profile.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {profile.username}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center mt-3">
            <p className="text-sm text-muted-foreground">Genre</p>
            <p className="font-medium text-foreground">{profile.genre}</p>
          </div>

          <div className="flex flex-row justify-between items-center mt-3">
            <p className="text-sm text-muted-foreground">Social Profiles</p>
            {/* Social media profile icon links */}
            {renderSocialIcons()}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div
        className={cn(
          "flex-1 p-4",
          isGrid ? "" : "flex flex-col justify-between"
        )}
      >
        {/* Action Button */}
        <div className="border-border">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewProfile(e);
            }}
            variant="outline"
            className="w-full bg-transparent border-[#5041D0] text-[#5041D0] hover:bg-[#5041D0] hover:text-white"
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export { DJProfileCards };
export type { DJProfileCardsProps };
