import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon, EyeIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Rank1 from "@/assets/images/Rank1.png";
import Rank2 from "@/assets/images/Rank2.png";
import Rank3 from "@/assets/images/Rank3.png";
import { Search } from "./ui/search";
import { useState, useMemo } from "react";

// Define Contestant interface
interface Contestant {
  id: string;
  name: string;
  votes: number;
  rank: number;
  imageUrl?: string;
}

interface HotOrNotEvent {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "upcoming";
  contestants: Contestant[];
  totalVotes: number;
  endsAt: string;
  categories: string[];
  imageUrl?: string;
}

interface LeaderboardDialogProps {
  event: HotOrNotEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaderboardDialog({
  event,
  open,
  onOpenChange,
}: LeaderboardDialogProps) {
  if (!event) return null;

  const contestants = event.contestants || [];
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contestants based on search query
  const filteredContestants = useMemo(() => {
    if (!searchQuery.trim()) {
      return contestants;
    }

    const query = searchQuery.toLowerCase().trim();
    return contestants.filter((contestant) =>
      contestant.name.toLowerCase().includes(query)
    );
  }, [contestants, searchQuery]);

  // Get top 3 contestants for the podium (unfiltered by search)
  const rank1Contestants = contestants.filter(
    (contestant: Contestant) => contestant.rank === 1
  );
  const rank2Contestants = contestants.filter(
    (contestant: Contestant) => contestant.rank === 2
  );
  const rank3Contestants = contestants.filter(
    (contestant: Contestant) => contestant.rank === 3
  );

  // Calculate time remaining
  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const timeRemaining = calculateTimeRemaining(event.endsAt);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <img src={Rank1} alt="Rank1 logo" className="scale-120" />;
      case 2:
        return <img src={Rank2} alt="Rank2 logo" />;
      case 3:
        return <img src={Rank3} alt="Rank3 logo" />;
      default:
        return `#${rank}`;
    }
  };

  const getInitials = (name: string): string => {
    if (!name || typeof name !== "string") {
      return "EV";
    }
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-muted">
        {/* Gradient Header */}
        <DialogHeader className="bg-gradient-to-r from-[#5014D0] to-[#38119F] text-white p-6">
          <DialogTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-[24px]">{event.title} - Leaderboard</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 hover:bg-white/20"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <p className="text-sm text-gray/80 mt-2 text-white">
            Top contestants and voting statistics
          </p>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
            <Card className="text-center shadow-none">
              <div className="flex items-center justify-center gap-2">
                <span className="font-semibold text-sm text-muted-foreground">
                  Total Contestants
                </span>
              </div>
              <p className="text-2xl font-bold text-[#5014D0]">
                {contestants.length}
              </p>
            </Card>

            <Card className="text-center shadow-none">
              <div className="flex items-center justify-center gap-2">
                <span className="font-semibold text-sm text-muted-foreground">
                  Total Votes
                </span>
              </div>
              <p className="text-2xl font-bold text-[#5014D0]">
                {event.totalVotes.toLocaleString()}
              </p>
            </Card>

            <Card className="text-center shadow-none">
              <div className="flex items-center justify-center gap-2">
                <span className="font-semibold text-sm text-muted-foreground">
                  Time Remaining
                </span>
              </div>
              <p className="text-2xl font-bold text-[#5014D0]">
                {timeRemaining}
              </p>
            </Card>
          </div>

          {/* Podium Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 items-center p-4 px-24 bg-white rounded-lg">
              {/* Rank 2 - Left */}
              {rank2Contestants.map((contestant: Contestant) => (
                <div
                  key={contestant.id}
                  className="transition-colors flex flex-col items-center"
                >
                  <div className="mb-3">
                    <Avatar className="h-20 w-20 border-[#5014D0] border-2">
                      <AvatarImage
                        src={contestant.imageUrl}
                        alt={contestant.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(contestant.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="-mt-8 mb-2">
                    <div>{getRankIcon(contestant.rank)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {contestant.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">{contestant.votes} votes</span>
                  </div>
                </div>
              ))}

              {/* Rank 1 - Middle (Magnified) */}
              {rank1Contestants.map((contestant: Contestant) => (
                <div
                  key={contestant.id}
                  className=" transition-colors flex flex-col items-center"
                >
                  <div className="mb-4">
                    <Avatar className="h-28 w-28 border-[#5014D0] border-2">
                      <AvatarImage
                        src={contestant.imageUrl}
                        alt={contestant.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                        {getInitials(contestant.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="-mt-10 mb-3">
                    <div className="scale-110">
                      {getRankIcon(contestant.rank)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base">
                      {contestant.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {contestant.votes} votes
                    </span>
                  </div>
                </div>
              ))}

              {/* Rank 3 - Right */}
              {rank3Contestants.map((contestant: Contestant) => (
                <div
                  key={contestant.id}
                  className=" transition-colors flex flex-col items-center"
                >
                  <div className="mb-3">
                    <Avatar className="h-20 w-20 border-[#5014D0] border-2">
                      <AvatarImage
                        src={contestant.imageUrl}
                        alt={contestant.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(contestant.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="-mt-8 mb-2">
                    <div>{getRankIcon(contestant.rank)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {contestant.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">{contestant.votes} votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Contestants Table */}
            <div className="space-y-4 bg-card rounded-lg p-6">
              <div className="flex flex-row justify-between items-center">
                <h3 className="font-bold text-lg flex flex-1 items-center gap-2">
                  {searchQuery ? "Search Results" : "All Contestants"}
                  {searchQuery && (
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredContestants.length} results)
                    </span>
                  )}
                </h3>
                <div>
                  <Search
                    placeholder="Search for contestants..."
                    value={searchQuery}
                    onSearchChange={handleSearchChange}
                    className="min-w-[280px] max-w-[380px] flex-1"
                  />
                </div>
              </div>

              {filteredContestants.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `No contestants found for "${searchQuery}"`
                      : "No contestants available"}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      onClick={clearSearch}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-sm">
                          Rank
                        </th>
                        <th className="text-left p-3 font-semibold text-sm">
                          Contestant
                        </th>
                        <th className="text-left p-3 font-semibold text-sm">
                          Votes
                        </th>
                        <th className="text-right p-3 font-semibold text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContestants.slice(0, 10).map((contestant: Contestant) => (
                        <tr
                          key={contestant.id}
                          className="border-t hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span>#{contestant.rank}</span>
                            </div>
                          </td>
                          <td className="p-3 font-medium flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={contestant.imageUrl}
                                alt={contestant.name}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {getInitials(contestant.name)}
                              </AvatarFallback>
                            </Avatar>
                            {contestant.name}
                          </td>
                          <td className="p-3 text-left font-medium">
                            {contestant.votes.toLocaleString()} Votes
                          </td>
                          <td className="p-3 text-right font-medium">
                            <Button variant={"ghost"}>
                              <EyeIcon className="text-[#8C8C8C] size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}