import { DJProfileCards } from "@/components/dj-profile-cards";
import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/search";
import { FilterIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useDJProfiles } from "@/hooks/useDJProfiles";
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useReduxDJProfile } from "@/hooks/useReduxDJProfile";

export function FindYourDJPage() {
  const navigate = useNavigate();
  // const { profiles, getStatistics } = useDJProfiles();
   const { 
    profiles, 
    getStatistics,
    getAllDJs,
    getTonightGigs 
  } = useReduxDJProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // Filter options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" },
    { value: "draft", label: "Draft" },
  ];

  const genreOptions = [
    { value: "amapiano", label: "Amapiano" },
    { value: "house", label: "House" },
    { value: "techno", label: "Techno" },
    { value: "afrobeats", label: "Afrobeats" },
    { value: "hip hop", label: "Hip Hop" },
    { value: "r&b", label: "R&B" },
    { value: "deep house", label: "Deep House" },
  ];

  // Get statistics
  const stats = getStatistics();

  useEffect(() => {
    getAllDJs();
    getTonightGigs();
  }, [getAllDJs, getTonightGigs]);

  const djCards: CardData[] = [
    {
      title: "Total DJ Profiles",
      value: stats.total.toString(),
      change: {
        description: "Active DJ profiles",
      },
      iconBgColor: "bg-[#C2410C]",
    },
    {
      title: "Active Profiles",
      value: stats.active.toString(),
      change: {
        description: "Currently live profiles",
      },
      iconBgColor: "bg-[#1E40AF]",
    },
    {
      title: "Disabled Profiles",
      value: stats.disabled.toString(),
      change: {
        description: "Inactive Profiles",
      },
      iconBgColor: "bg-[#065F46]",
    },
    {
      title: "Drafts",
      value: stats.drafts.toString(),
      change: {
        description: "Draft profiles",
      },
      iconBgColor: "bg-[#38119F]",
    },
  ];

  // Filter handlers
  const handleStatusFilterChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleGenreFilterChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedGenres([]);
    setSearchQuery("");
  };

  // Filter profiles based on search and filters
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesSearch =
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(profile.status);

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) =>
          profile.genre.toLowerCase().includes(genre.toLowerCase())
        );

      return matchesSearch && matchesStatus && matchesGenre;
    });
  }, [profiles, searchQuery, selectedStatuses, selectedGenres]);

  const handleViewProfile = (profile: any) => {
    console.log("View profile:", profile.id);
    navigate(`/admin/find-your-dj/${profile.id}/view`);
  };

  const handleEditProfile = (profile: any) => {
    console.log("Edit profile:", profile.id);
    navigate(`/admin/find-your-dj/${profile.id}/edit`);
  };

  const handleDeleteProfile = (profile: any) => {
    // Handle delete logic here
    console.log("Delete profile:", profile.id);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        label="Find Your DJ Management"
        rightActions={
          <Button
            variant="secondary"
            className="bg-[#5041D0] hover:bg-[#5041D0]/90 text-white h-11"
            onClick={() => navigate("/admin/find-your-dj/add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add DJ Profile
          </Button>
        }
      />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={djCards} layout="1x4" />

          <Card className="px-6">
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <Search
                  placeholder="Search DJ profiles by name, username, genre, or location..."
                  value={searchQuery}
                  onSearchChange={setSearchQuery}
                  className="rounded-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {/* Status Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-11"
                    >
                      <FilterIcon className="w-4 h-4" />
                      All Status
                      {selectedStatuses.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedStatuses.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {statusOptions.map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status.value}
                        checked={selectedStatuses.includes(status.value)}
                        onCheckedChange={() =>
                          handleStatusFilterChange(status.value)
                        }
                      >
                        {status.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Genre Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-11"
                    >
                      <FilterIcon className="w-4 h-4" />
                      All Genres
                      {selectedGenres.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedGenres.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {genreOptions.map((genre) => (
                      <DropdownMenuCheckboxItem
                        key={genre.value}
                        checked={selectedGenres.includes(genre.value)}
                        onCheckedChange={() =>
                          handleGenreFilterChange(genre.value)
                        }
                      >
                        {genre.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters Button */}
                {(selectedStatuses.length > 0 ||
                  selectedGenres.length > 0 ||
                  searchQuery) && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-sm"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* DJ Profile Cards Component */}
            <div className="">
              <DJProfileCards
                profiles={filteredProfiles}
                layout={layout}
                onLayoutChange={setLayout}
                onViewProfile={handleViewProfile}
                onEditProfile={handleEditProfile}
                onDeleteProfile={handleDeleteProfile}
                searchValue={searchQuery}
                selectedStatus={
                  selectedStatuses.length > 0
                    ? selectedStatuses.join(",")
                    : "all"
                }
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
