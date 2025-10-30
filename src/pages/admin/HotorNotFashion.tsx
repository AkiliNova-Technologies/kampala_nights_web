import {
  HotOrNotCards,
  type HotOrNotEvent,
} from "@/components/hot-or-not-cards";
import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/search";
import {
  FilterIcon,
  Trophy,
  Plus,
  Flame,
  Clock3,
  CircleCheckBig,
  EyeIcon,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { LeaderboardDialog } from "@/components/leaderboard-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AddCategoryDialog,
  type CategoryFormData,
} from "@/components/add-category-dialog";
import {
  DataTable,
  type TableAction,
  type TableData,
  type TableField,
} from "@/components/data-table";
import { Image } from "@/components/ui/image";
import { useNavigate, useParams } from "react-router-dom";
import { NominationDialog } from "@/components/nomination-dialog";
import { useReduxHotOrNot } from "@/hooks/useReduxHotOrNot";
import type { NominationCandidate, HotOrNotContest } from "@/types/hot-or-not";
import type { Campaign } from "@/types/campaign";

// Update Contestant interface to match real data
interface Contestant extends TableData {
  id: string;
  username: string;
  name?: string;
  imageCaption: string;
  votes: number;
  imageUrl?: string;
  status: "active" | "completed" | "draft";
  postImage?: string;
  postId?: string; // Add postId for nomination
}

// Fix: Create a compatible EventStatus type that matches HotOrNotEvent
type CompatibleEventStatus = "active" | "completed" | "upcoming";

type EventTab =
  | "contestants"
  | "ongoing_campaigns"
  | "completed_campaigns"
  | "drafts";

export function HotOrNotFashionPage() {
  const navigate = useNavigate();
  const { theme } = useParams<{ theme: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<EventTab>("contestants");
  const [selectedStatuses, setSelectedStatuses] = useState<
    CompatibleEventStatus[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [selectedContestants, setSelectedContestants] = useState<Contestant[]>(
    []
  );
  const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
  const [isNominating, setIsNominating] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<HotOrNotEvent | null>(
    null
  );
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Use Redux hook for real data with FASHION theme filtering
  const {
    // State
    contests,
    nominationCandidates,
    loading,

    // Filtered contests
    activeContests,

    // Actions
    fetchContests,
    fetchNominationCandidates,
    assignNominees,
    getContestWithLeaderboard,
  } = useReduxHotOrNot({
    mode: "admin",
    autoLoad: true,
    theme: "FASHION", // Only get FASHION contests
  });

  // Fetch data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "contestants") {
          await fetchNominationCandidates({ theme: "FASHION" });
        } else {
          await fetchContests({ forceRefresh: true, theme: "FASHION" });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [activeTab, fetchContests, fetchNominationCandidates]);

  const statusOptions: { value: CompatibleEventStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
  ];

  const categoryOptions = [
    { value: "FASHION", label: "Fashion" },
    { value: "NIGHTLIFE", label: "Nightlife" },
  ];

  // Transform nomination candidates to contestants for the table
  const contestantsData: Contestant[] = useMemo(() => {
    return nominationCandidates.map((candidate: NominationCandidate) => ({
      id: candidate.id,
      postId: candidate.id, // Use candidate id as postId for nomination
      username: candidate.author.username,
      imageCaption: candidate.caption,
      votes: candidate.likeCount,
      postImage: candidate.PostMedia[0]?.url,
      status: "active" as const,
    }));
  }, [nominationCandidates]);

  // Transform contests to HotOrNotEvent format for cards
  const eventsData: HotOrNotEvent[] = useMemo(() => {
    return contests.map((contest: HotOrNotContest) => {
      // Calculate total votes from contestants
      const totalVotes = contest.contestants.reduce((sum, contestant) => {
        return sum + (contestant.voteCount || 0);
      }, 0);

      // Calculate end date from startDate + durationHours
      const endsAt =
        contest.startDate && contest.durationHours
          ? new Date(
              new Date(contest.startDate).getTime() +
                contest.durationHours * 60 * 60 * 1000
            ).toISOString()
          : new Date().toISOString(); // Fallback to current date

      // Fix: Map status to compatible type (exclude "draft")
      const mappedStatus: CompatibleEventStatus =
        contest.status === "DRAFT"
          ? "upcoming" // Map draft to upcoming for compatibility
          : contest.status === "ACTIVE"
          ? "active"
          : contest.status === "CLOSED"
          ? "completed"
          : "upcoming";

      return {
        id: contest.id,
        title: contest.category,
        description: contest.description || "",
        coverImage: contest.coverImageUrl,
        categories: [contest.theme],
        status: mappedStatus,
        contestants: contest.contestants.map((contestant) => ({
          id: contestant.id,
          name: contestant.post.author?.username || "Unknown",
          votes: contestant.voteCount || 0,
          rank: 0, // This would need to be calculated from leaderboard
          imageUrl: contestant.post.PostMedia[0]?.url,
        })),
        totalVotes,
        endsAt,
        imageUrl: contest.coverImageUrl,
      };
    });
  }, [contests]);

  // Get active campaigns for nomination dialog
  const activeCampaigns: Campaign[] = useMemo(() => {
    return activeContests.map((contest) => ({
      id: contest.id,
      title: contest.category,
      description: contest.description || "", // Fix: Provide default empty string
      status: "active" as const,
      category: contest.theme,
    }));
  }, [activeContests]);

  // Helper function to determine if an event belongs to a main category
  const eventBelongsToCategory = (
    event: HotOrNotEvent,
    category: string
  ): boolean => {
    return event.categories.includes(category);
  };

  const filteredEvents = useMemo(() => {
    let filtered = eventsData;

    // Filter by active tab
    if (activeTab === "contestants") {
      // Show all events in contestants tab
      filtered = filtered;
    } else if (activeTab === "ongoing_campaigns") {
      // Show only active events
      filtered = filtered.filter((event) => event.status === "active");
    } else if (activeTab === "completed_campaigns") {
      // Show only completed events
      filtered = filtered.filter((event) => event.status === "completed");
    } else if (activeTab === "drafts") {
      // Show only upcoming events (mapped from drafts)
      filtered = filtered.filter((event) => event.status === "upcoming");
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((event) =>
        selectedStatuses.includes(event.status)
      );
    }

    // Apply category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.some((category) =>
          eventBelongsToCategory(event, category)
        )
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [
    eventsData,
    activeTab,
    selectedStatuses,
    selectedCategories,
    searchQuery,
  ]);

  const handleStatusFilterChange = (status: CompatibleEventStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSearchQuery("");
  };

  // Calculate statistics based on real data (only FASHION contests)
  const totalEvents = contests.length;
  const activeEvents = activeContests.length;
  const totalContestants = contests.reduce(
    (sum, contest) => sum + contest.contestants.length,
    0
  );
  const totalVotes = contests.reduce(
    (sum, contest) =>
      sum +
      contest.contestants.reduce(
        (contestSum, contestant) => contestSum + (contestant.voteCount || 0),
        0
      ),
    0
  );

  const hotOrNotCards: CardData[] = [
    {
      title: "Total Campaigns",
      value: totalEvents.toString(),
      change: {
        description: "Fashion contest categories",
      },
      rightIcon: <Flame className="h-4 w-4" />,
      iconBgColor: "bg-[#C2410C]",
    },
    {
      title: "Active Contestants",
      value: activeEvents.toString(),
      change: {
        description: "Currently competing users",
      },
      rightIcon: <Clock3 className="h-4 w-4" />,
      iconBgColor: "bg-[#1E40AF]",
    },
    {
      title: "Active Campaigns",
      value: totalContestants.toString(),
      change: {
        description: "Ongoing campaigns",
      },
      rightIcon: <CircleCheckBig className="h-4 w-4" />,
      iconBgColor: "bg-[#065F46]",
    },
    {
      title: "Completed Campaigns",
      value: totalVotes.toLocaleString(),
      change: {
        description: "Finished campaigns",
      },
      rightIcon: <Trophy className="h-4 w-4" />,
      iconBgColor: "bg-[#38119F]",
    },
  ];

  const handleViewLeaderboard = async (event: HotOrNotEvent) => {
    setSelectedEvent(event);
    try {
      await getContestWithLeaderboard(event.id);
      setIsLeaderboardOpen(true);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  };

  const handleCreateCategory = (data: CategoryFormData) => {
    console.log("Category data:", data);
    // Handle the form submission here
    setIsDialogOpen(false);
  };

  const contestantFields: TableField<Contestant>[] = [
    {
      key: "username",
      header: "Username",
      enableHiding: false,
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          {row.postImage ? (
            <Image
              src={row.postImage}
              alt={`Post by ${row.username}`}
              size="sm"
              aspectRatio="1:1"
              fit="cover"
              radius="md"
              className="size-16"
              loading="lazy"
            />
          ) : (
            <div className="size-16 bg-muted rounded-md flex items-center justify-center border-2 border-dashed">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.username}</span>
            <span className="text-xs text-muted-foreground">
              {row.votes.toLocaleString()} likes
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "imageCaption",
      header: "Image Caption",
      cell: (value) => (
        <div className="max-w-xs">
          <span className="text-sm text-muted-foreground line-clamp-2">
            {value as string}
          </span>
        </div>
      ),
    },
    {
      key: "votes",
      header: "Likes",
      cell: (value) => (
        <div className="text-left">
          <span className="font-medium">
            {(value as number).toLocaleString()}
          </span>
        </div>
      ),
      align: "left",
      enableSorting: true,
    },
  ];

  const contestantActions: TableAction<Contestant>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (contestant) => {
        console.log("View contestant:", contestant);
        // Handle view contestant details
      },
    },
  ];

  const handleNominateClick = (contestants: Contestant[]) => {
    setSelectedContestants(contestants);
    setIsNominationDialogOpen(true);
  };

  const handleNominateConfirm = async (
    contestantIds: string[],
    campaignId: string
  ) => {
    setIsNominating(true);

    try {
      // Use real API call to nominate contestants
      const result = await assignNominees(campaignId, {
        postIds: contestantIds,
      });

      // Check if the action was successful
      if (result) {
        // Success - close dialog and reset selection
        setIsNominationDialogOpen(false);
        setSelectedContestants([]);

        // Refresh nomination candidates
        await fetchNominationCandidates({
          theme: "FASHION",
          forceRefresh: true,
        });

        console.log("Successfully nominated contestants!");
        // You might want to show a success toast here
      } else {
        throw new Error("Failed to nominate contestants");
      }
    } catch (error) {
      console.error("Failed to nominate contestants:", error);
      // You might want to show an error toast here
    } finally {
      setIsNominating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        label={`Hot or Not - ${theme || "Fashion"}`} // Add fallback
        rightActions={
          <Button
            variant="secondary"
            className="bg-[#5041D0] hover:bg-[#5041D0]/90 text-white h-11"
            onClick={() =>
              navigate(
                `/admin/hot-or-not/add-category/${(
                  theme || "FASHION"
                ).toLowerCase()}`
              )
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Create {theme || "Fashion"} Contest
          </Button>
        }
      />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          {/* Statistics Cards */}
          <SectionCards cards={hotOrNotCards} layout="1x4" />

          <div className="space-y-4">
            {/* Hot or Not Events Section */}
            <div className="rounded-lg border bg-card py-6 mb-3">
              {/* Header */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as EventTab)}
                className="px-6 w-full bg-transparent rounded-none"
              >
                <TabsList className="grid w-full max-w-full grid-cols-4 rounded-none p-0 bg-transparent border-b mb-6">
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="contestants"
                  >
                    Contestants
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent  border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="ongoing_campaigns"
                  >
                    Ongoing Campaigns
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="completed_campaigns"
                  >
                    Completed Campaigns
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent  border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="drafts"
                  >
                    Drafts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contestants" className="mt-0">
                  <div className="">
                    {/* Search and Filter Section for Contestants */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center justify-between mb-6">
                      <div className="flex-1">
                        <Search
                          placeholder="Search for contestants, username"
                          value={searchQuery}
                          onSearchChange={setSearchQuery}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedContestants([])}
                            className="text-sm h-11"
                            disabled={selectedContestants.length === 0}
                          >
                            Clear Selection
                          </Button>
                          <Button
                            onClick={() =>
                              handleNominateClick(selectedContestants)
                            }
                            className="bg-[#5041D0] hover:bg-[#5041D0]/90 text-white h-11"
                            disabled={
                              selectedContestants.length === 0 ||
                              nominationCandidates.length === 0
                            }
                          >
                            Nominate
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Contestants Table */}
                    <div>
                      <DataTable<Contestant>
                        data={contestantsData}
                        fields={contestantFields}
                        actions={contestantActions}
                        enableSelection={true}
                        enablePagination={true}
                        pageSize={10}
                        loading={loading}
                        onSelectionChange={setSelectedContestants}
                        onRowClick={(contestant) => {
                          console.log("Contestant clicked:", contestant);
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ongoing_campaigns" className="mt-0">
                  {/* Search and Filter Section */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                      <Search
                        placeholder="Search voting events by title, category, or description..."
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

                      {/* Category Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-11"
                          >
                            <FilterIcon className="w-4 h-4" />
                            All Categories
                            {selectedCategories.length > 0 && (
                              <Badge variant="secondary" className="ml-1">
                                {selectedCategories.length}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {categoryOptions.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category.value}
                              checked={selectedCategories.includes(
                                category.value
                              )}
                              onCheckedChange={() =>
                                handleCategoryFilterChange(category.value)
                              }
                            >
                              {category.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Clear Filters Button */}
                      {(selectedStatuses.length > 0 ||
                        selectedCategories.length > 0 ||
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

                  {/* Hot or Not Cards Component */}
                  <div className="mt-6">
                    <HotOrNotCards
                      events={filteredEvents}
                      layout={layout}
                      onLayoutChange={setLayout}
                      onViewLeaderboard={handleViewLeaderboard}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="completed_campaigns" className="mt-0">
                  {/* Search and Filter Section */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                      <Search
                        placeholder="Search voting events by title, category, or description..."
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

                      {/* Category Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-11"
                          >
                            <FilterIcon className="w-4 h-4" />
                            All Categories
                            {selectedCategories.length > 0 && (
                              <Badge variant="secondary" className="ml-1">
                                {selectedCategories.length}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {categoryOptions.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category.value}
                              checked={selectedCategories.includes(
                                category.value
                              )}
                              onCheckedChange={() =>
                                handleCategoryFilterChange(category.value)
                              }
                            >
                              {category.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Clear Filters Button */}
                      {(selectedStatuses.length > 0 ||
                        selectedCategories.length > 0 ||
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

                  {/* Hot or Not Cards Component */}
                  <div className="mt-6">
                    <HotOrNotCards
                      events={filteredEvents}
                      layout={layout}
                      onLayoutChange={setLayout}
                      onViewLeaderboard={handleViewLeaderboard}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="drafts" className="mt-0">
                  {/* Search and Filter Section */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                      <Search
                        placeholder="Search voting events by title, category, or description..."
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

                      {/* Category Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-11"
                          >
                            <FilterIcon className="w-4 h-4" />
                            All Categories
                            {selectedCategories.length > 0 && (
                              <Badge variant="secondary" className="ml-1">
                                {selectedCategories.length}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {categoryOptions.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category.value}
                              checked={selectedCategories.includes(
                                category.value
                              )}
                              onCheckedChange={() =>
                                handleCategoryFilterChange(category.value)
                              }
                            >
                              {category.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Clear Filters Button */}
                      {(selectedStatuses.length > 0 ||
                        selectedCategories.length > 0 ||
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

                  {/* Hot or Not Cards Component */}
                  <div className="mt-6">
                    <HotOrNotCards
                      events={filteredEvents}
                      layout={layout}
                      onLayoutChange={setLayout}
                      onViewLeaderboard={handleViewLeaderboard}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <NominationDialog
        open={isNominationDialogOpen}
        onOpenChange={setIsNominationDialogOpen}
        selectedContestants={selectedContestants}
        onNominate={handleNominateConfirm}
        campaigns={activeCampaigns}
        loading={isNominating}
      />

      <AddCategoryDialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(false)}
        onSubmit={handleCreateCategory}
      />

      {/* Leaderboard Dialog */}
      <LeaderboardDialog
        event={selectedEvent}
        open={isLeaderboardOpen}
        onOpenChange={setIsLeaderboardOpen}
      />
    </div>
  );
}
