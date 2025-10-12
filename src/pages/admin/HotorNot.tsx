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
} from "lucide-react";
import { useState, useMemo } from "react";
import { LeaderboardDialog } from "@/components/leaderboard-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import demo1 from "@/assets/images/hOn1.png";
import demo2 from "@/assets/images/hOn2.png";
import demo3 from "@/assets/images/hOn3.png";
import demo4 from "@/assets/images/hOn4.png";
import demo5 from "@/assets/images/hOn5.png";
import demo6 from "@/assets/images/hOn6.png";
import {
  AddCategoryDialog,
  type CategoryFormData,
} from "@/components/add-category-dialog";

type EventStatus = "active" | "completed" | "upcoming";

type EventTab = "fashion" | "nightlife";

export function HotOrNotPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<EventTab>("fashion");
  const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const [selectedEvent, setSelectedEvent] = useState<HotOrNotEvent | null>(
    null
  );
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Define which categories belong to Fashion vs Nightlife
  const categoryMapping = {
    fashion: ["Fashion", "fashion"],
    nightlife: ["nightlife", "Nightlife"],
  };

  const [eventsData] = useState<HotOrNotEvent[]>([
    {
      id: "1",
      title: "Vintage Old School",
      description: "Classic retro fashion styles from the golden eras...",
      status: "active",
      contestants: [
        { id: "1-1", name: "Joan Kazibwe", votes: 480, rank: 1 },
        { id: "1-2", name: "Wandera Kazibwe", votes: 380, rank: 2 },
        { id: "1-3", name: "Mark Lubega", votes: 300, rank: 3 },
        { id: "1-4", name: "Sarah Nakato", votes: 280, rank: 4 },
        { id: "1-5", name: "David Omondi", votes: 250, rank: 5 },
        { id: "1-6", name: "Grace Auma", votes: 220, rank: 6 },
        { id: "1-7", name: "Brian Kato", votes: 200, rank: 7 },
        { id: "1-8", name: "Patricia Nalubega", votes: 180, rank: 8 },
        { id: "1-9", name: "Alex Tumusiime", votes: 150, rank: 9 },
        { id: "1-10", name: "Sheila Nansubuga", votes: 120, rank: 10 },
        { id: "1-11", name: "Michael Ssebunya", votes: 100, rank: 11 },
        { id: "1-12", name: "Rita Nalwanga", votes: 90, rank: 12 },
        { id: "1-13", name: "Peter Okot", votes: 85, rank: 13 },
        { id: "1-14", name: "Susan Akello", votes: 80, rank: 14 },
        { id: "1-15", name: "Joseph Mwangi", votes: 75, rank: 15 },
        { id: "1-16", name: "Lydia Namutebi", votes: 70, rank: 16 },
        { id: "1-17", name: "Daniel Kibet", votes: 65, rank: 17 },
        { id: "1-18", name: "Monica Nalubowa", votes: 60, rank: 18 },
        { id: "1-19", name: "Robert Mugisha", votes: 55, rank: 19 },
        { id: "1-20", name: "Esther Nanyonjo", votes: 50, rank: 20 },
        { id: "1-21", name: "Samuel Otieno", votes: 45, rank: 21 },
        { id: "1-22", name: "Prossy Nabbosa", votes: 40, rank: 22 },
        { id: "1-23", name: "Andrew Kawooya", votes: 35, rank: 23 },
        { id: "1-24", name: "Jennifer Nalule", votes: 30, rank: 24 },
      ],
      totalVotes: 2100,
      endsAt: "2025-09-26",
      categories: ["Nightlife"],
      imageUrl: demo1,
    },
    {
      id: "2",
      title: "Street Style",
      description: "Urban fashion that defines contemporary street culture...",
      status: "active",
      contestants: [
        { id: "2-1", name: "Marcus Johnson", votes: 520, rank: 1 },
        { id: "2-2", name: "Tyler Chen", votes: 450, rank: 2 },
        { id: "2-3", name: "Jamal Washington", votes: 380, rank: 3 },
        { id: "2-4", name: "Sofia Rodriguez", votes: 320, rank: 4 },
        { id: "2-5", name: "Kevin Martinez", votes: 290, rank: 5 },
        { id: "2-6", name: "Aisha Patel", votes: 260, rank: 6 },
        { id: "2-7", name: "Carlos Garcia", votes: 230, rank: 7 },
        { id: "2-8", name: "Maya Thompson", votes: 210, rank: 8 },
        { id: "2-9", name: "Jordan Lee", votes: 190, rank: 9 },
        { id: "2-10", name: "Riley Smith", votes: 170, rank: 10 },
        { id: "2-11", name: "Zoe Williams", votes: 150, rank: 11 },
        { id: "2-12", name: "Ethan Brown", votes: 130, rank: 12 },
        { id: "2-13", name: "Chloe Davis", votes: 120, rank: 13 },
        { id: "2-14", name: "Noah Miller", votes: 110, rank: 14 },
        { id: "2-15", name: "Isabella Wilson", votes: 100, rank: 15 },
        { id: "2-16", name: "Liam Moore", votes: 90, rank: 16 },
        { id: "2-17", name: "Emma Taylor", votes: 85, rank: 17 },
        { id: "2-18", name: "Lucas Anderson", votes: 80, rank: 18 },
        { id: "2-19", name: "Ava Thomas", votes: 75, rank: 19 },
        { id: "2-20", name: "Mason Jackson", votes: 70, rank: 20 },
        { id: "2-21", name: "Sophia White", votes: 65, rank: 21 },
        { id: "2-22", name: "Logan Harris", votes: 60, rank: 22 },
        { id: "2-23", name: "Mia Martin", votes: 55, rank: 23 },
        { id: "2-24", name: "Oliver Thompson", votes: 50, rank: 24 },
      ],
      totalVotes: 2100,
      endsAt: "2025-09-26",
      categories: ["Fashion"],
      imageUrl: demo2,
    },
    {
      id: "3",
      title: "Smart & Classy",
      description: "Sophisticated formal wear that exudes elegance...",
      status: "active",
      contestants: [
        { id: "3-1", name: "Eleanor Vanderbilt", votes: 600, rank: 1 },
        { id: "3-2", name: "Alexander Harrington", votes: 480, rank: 2 },
        { id: "3-3", name: "Charlotte Montgomery", votes: 420, rank: 3 },
        { id: "3-4", name: "William Kensington", votes: 380, rank: 4 },
        { id: "3-5", name: "Victoria Ashford", votes: 350, rank: 5 },
        { id: "3-6", name: "James Wellington", votes: 320, rank: 6 },
        { id: "3-7", name: "Margaret Fairchild", votes: 290, rank: 7 },
        { id: "3-8", name: "Richard Lancaster", votes: 270, rank: 8 },
        { id: "3-9", name: "Catherine Beaumont", votes: 250, rank: 9 },
        { id: "3-10", name: "Henry Cavendish", votes: 230, rank: 10 },
        { id: "3-11", name: "Elizabeth Sinclair", votes: 210, rank: 11 },
        { id: "3-12", name: "Charles Davenport", votes: 190, rank: 12 },
        { id: "3-13", name: "Anne Fitzroy", votes: 180, rank: 13 },
        { id: "3-14", name: "Edward Blackwood", votes: 170, rank: 14 },
        { id: "3-15", name: "Diana Pembroke", votes: 160, rank: 15 },
        { id: "3-16", name: "George Ashworth", votes: 150, rank: 16 },
        { id: "3-17", name: "Beatrice Hawthorne", votes: 140, rank: 17 },
        { id: "3-18", name: "Frederick Chadwick", votes: 130, rank: 18 },
        { id: "3-19", name: "Lucinda Radcliffe", votes: 120, rank: 19 },
        { id: "3-20", name: "Arthur Kingsley", votes: 110, rank: 20 },
        { id: "3-21", name: "Genevieve Prescott", votes: 100, rank: 21 },
        { id: "3-22", name: "Rupert Ellington", votes: 95, rank: 22 },
        { id: "3-23", name: "Penelope Ashbury", votes: 90, rank: 23 },
        { id: "3-24", name: "Alistair Croft", votes: 85, rank: 24 },
      ],
      totalVotes: 2100,
      endsAt: "2025-09-26",
      categories: ["Fashion"],
      imageUrl: demo3,
    },
    {
      id: "4",
      title: "Beach Vibes",
      description: "Summer beach fashion and resort wear collections...",
      status: "upcoming",
      contestants: [
        { id: "4-1", name: "Kai Nakamura", votes: 0, rank: 1 },
        { id: "4-2", name: "Leilani Santos", votes: 0, rank: 2 },
        { id: "4-3", name: "Rio Tanaka", votes: 0, rank: 3 },
        { id: "4-4", name: "Sienna Cruz", votes: 0, rank: 4 },
        { id: "4-5", name: "Orion Delgado", votes: 0, rank: 5 },
        { id: "4-6", name: "Zara Fernandez", votes: 0, rank: 6 },
        { id: "4-7", name: "Koa Hernandez", votes: 0, rank: 7 },
        { id: "4-8", name: "Nalani Gonzalez", votes: 0, rank: 8 },
        { id: "4-9", name: "Kai Silva", votes: 0, rank: 9 },
        { id: "4-10", name: "Malia Reyes", votes: 0, rank: 10 },
        { id: "4-11", name: "Kaimana Torres", votes: 0, rank: 11 },
        { id: "4-12", name: "Noe Ramirez", votes: 0, rank: 12 },
        { id: "4-13", name: "Kailani Flores", votes: 0, rank: 13 },
        { id: "4-14", name: "Makani Ortiz", votes: 0, rank: 14 },
        { id: "4-15", name: "Anela Vargas", votes: 0, rank: 15 },
        { id: "4-16", name: "Kekoa Morales", votes: 0, rank: 16 },
        { id: "4-17", name: "Haley Gutierrez", votes: 0, rank: 17 },
        { id: "4-18", name: "Kai Castillo", votes: 0, rank: 18 },
      ],
      totalVotes: 0,
      endsAt: "2025-10-15",
      categories: ["Fashion"],
      imageUrl: demo4,
    },
    {
      id: "5",
      title: "Winter Collection",
      description: "Cozy winter fashion and cold weather essentials...",
      status: "completed",
      contestants: [
        { id: "5-1", name: "Freya Olsen", votes: 850, rank: 1 },
        { id: "5-2", name: "Bjorn Schmidt", votes: 720, rank: 2 },
        { id: "5-3", name: "Astrid Berg", votes: 680, rank: 3 },
        { id: "5-4", name: "Lars Jorgensen", votes: 620, rank: 4 },
        { id: "5-5", name: "Ingrid Larsen", votes: 580, rank: 5 },
        { id: "5-6", name: "Sven Andersen", votes: 540, rank: 6 },
        { id: "5-7", name: "Hilda Nilsson", votes: 510, rank: 7 },
        { id: "5-8", name: "Gunnar Eriksen", votes: 480, rank: 8 },
        { id: "5-9", name: "Sigrid Hansen", votes: 450, rank: 9 },
        { id: "5-10", name: "Leif Johansson", votes: 420, rank: 10 },
        { id: "5-11", name: "Elsa Pedersen", votes: 400, rank: 11 },
        { id: "5-12", name: "Magnus Dahl", votes: 380, rank: 12 },
        { id: "5-13", name: "Solveig Holm", votes: 360, rank: 13 },
        { id: "5-14", name: "Stian Lund", votes: 340, rank: 14 },
        { id: "5-15", name: "Marta Solberg", votes: 320, rank: 15 },
        { id: "5-16", name: "Vidar Nilsen", votes: 300, rank: 16 },
        { id: "5-17", name: "Kari Amundsen", votes: 280, rank: 17 },
        { id: "5-18", name: "Torstein Haugen", votes: 260, rank: 18 },
        { id: "5-19", name: "Runa Iversen", votes: 240, rank: 19 },
        { id: "5-20", name: "Einar Bakke", votes: 220, rank: 20 },
        { id: "5-21", name: "Liv Strand", votes: 200, rank: 21 },
        { id: "5-22", name: "Jorgen Lie", votes: 180, rank: 22 },
        { id: "5-23", name: "Siv Aas", votes: 160, rank: 23 },
        { id: "5-24", name: "Oddvar Moe", votes: 140, rank: 24 },
        { id: "5-25", name: "Britt Sand", votes: 120, rank: 25 },
        { id: "5-26", name: "Arne Foss", votes: 100, rank: 26 },
        { id: "5-27", name: "Tone Berg", votes: 90, rank: 27 },
        { id: "5-28", name: "Per Lunde", votes: 80, rank: 28 },
        { id: "5-29", name: "Anne Kristiansen", votes: 70, rank: 29 },
        { id: "5-30", name: "Knut Sorensen", votes: 60, rank: 30 },
        { id: "5-31", name: "Mona Jacobsen", votes: 50, rank: 31 },
        { id: "5-32", name: "Steinar Olsen", votes: 40, rank: 32 },
      ],
      totalVotes: 4500,
      endsAt: "2025-08-30",
      categories: ["Nightlife"],
      imageUrl: demo5,
    },
    {
      id: "6",
      title: "Athleisure",
      description: "Sporty fashion meets everyday comfort and style...",
      status: "active",
      contestants: [
        { id: "6-1", name: "Jordan Carter", votes: 680, rank: 1 },
        { id: "6-2", name: "Taylor Morgan", votes: 590, rank: 2 },
        { id: "6-3", name: "Casey Parker", votes: 520, rank: 3 },
        { id: "6-4", name: "Riley Jordan", votes: 480, rank: 4 },
        { id: "6-5", name: "Alex Morgan", votes: 440, rank: 5 },
        { id: "6-6", name: "Drew Bennett", votes: 410, rank: 6 },
        { id: "6-7", name: "Blair Foster", votes: 380, rank: 7 },
        { id: "6-8", name: "Morgan Hayes", votes: 350, rank: 8 },
        { id: "6-9", name: "Cameron Reed", votes: 320, rank: 9 },
        { id: "6-10", name: "Quinn Sullivan", votes: 300, rank: 10 },
        { id: "6-11", name: "Avery Collins", votes: 280, rank: 11 },
        { id: "6-12", name: "Rowan Gallagher", votes: 260, rank: 12 },
        { id: "6-13", name: "Skyler Vance", votes: 240, rank: 13 },
        { id: "6-14", name: "Peyton Rhodes", votes: 220, rank: 14 },
        { id: "6-15", name: "Dakota Shaw", votes: 200, rank: 15 },
        { id: "6-16", name: "Emerson Cross", votes: 180, rank: 16 },
        { id: "6-17", name: "Finley Stone", votes: 160, rank: 17 },
        { id: "6-18", name: "Harper Wells", votes: 140, rank: 18 },
        { id: "6-19", name: "Sawyer Grant", votes: 120, rank: 19 },
        { id: "6-20", name: "Justice Ford", votes: 100, rank: 20 },
        { id: "6-21", name: "Phoenix Miles", votes: 90, rank: 21 },
        { id: "6-22", name: "River Brooks", votes: 80, rank: 22 },
        { id: "6-23", name: "Sailor Knight", votes: 70, rank: 23 },
        { id: "6-24", name: "Arden Lane", votes: 60, rank: 24 },
        { id: "6-25", name: "Reese Fox", votes: 50, rank: 25 },
        { id: "6-26", name: "Tatum Cole", votes: 40, rank: 26 },
        { id: "6-27", name: "London Pierce", votes: 30, rank: 27 },
        { id: "6-28", name: "Memphis Hunt", votes: 20, rank: 28 },
      ],
      totalVotes: 3200,
      endsAt: "2025-10-05",
      categories: ["Nightlife"],
      imageUrl: demo6,
    },
  ]);

  const statusOptions: { value: EventStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
  ];

  // Update category options to only show Fashion and Nightlife
  const categoryOptions = [
    { value: "Fashion", label: "Fashion" },
    { value: "Nightlife", label: "Nightlife" },
  ];

  // Helper function to determine if an event belongs to a main category
  const eventBelongsToCategory = (
    event: HotOrNotEvent,
    category: string
  ): boolean => {
    if (category === "Fashion") {
      return event.categories.some((cat) =>
        categoryMapping.fashion.includes(cat)
      );
    } else if (category === "Nightlife") {
      return event.categories.some((cat) =>
        categoryMapping.nightlife.includes(cat)
      );
    }
    return false;
  };

  const filteredEvents = useMemo(() => {
    let filtered = eventsData;

    // Filter by active tab (Fashion vs Nightlife)
    if (activeTab === "fashion") {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) => categoryMapping.fashion.includes(cat))
      );
    } else if (activeTab === "nightlife") {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) => categoryMapping.nightlife.includes(cat))
      );
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

  const handleStatusFilterChange = (status: EventStatus) => {
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

  // Calculate statistics based on filtered events by tab
  const totalEvents = filteredEvents.length;
  const activeEvents = filteredEvents.filter(
    (event) => event.status === "active"
  ).length;
  const totalContestants = filteredEvents.reduce(
    (sum, event) => sum + event.contestants.length,
    0
  );
  const totalVotes = filteredEvents.reduce(
    (sum, event) => sum + event.totalVotes,
    0
  );

  const hotOrNotCards: CardData[] = [
    {
      title: "Total Categories",
      value: totalEvents.toString(),
      change: {
        description: "Active contest categories",
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

  const handleViewLeaderboard = (event: HotOrNotEvent) => {
    setSelectedEvent(event);
    setIsLeaderboardOpen(true);
  };

  const handleCreateCategory = (data: CategoryFormData) => {
    console.log("Category data:", data);
    // Handle the form submission here
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        label="Hot or Not Management"
        rightActions={
          <Button
            variant="secondary"
            className="bg-[#5041D0] hover:bg-[#5041D0]/90 text-white h-11"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add category
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
                <TabsList className="grid w-full max-w-full grid-cols-2 rounded-none p-0 bg-transparent border-b mb-6">
                  <TabsTrigger
                    className="bg-transparent  border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="fashion"
                  >
                    Fashion
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="nightlife"
                  >
                    Nightlife
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fashion" className="mt-0"></TabsContent>
                <TabsContent value="nightlife" className="mt-0"></TabsContent>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
                          checked={selectedCategories.includes(category.value)}
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
              <div className="px-6 mt-6">
                <HotOrNotCards
                  events={filteredEvents}
                  layout={layout}
                  onLayoutChange={setLayout}
                  onViewLeaderboard={handleViewLeaderboard}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

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
