import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SectionCards, type CardData } from "@/components/section-cards";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FilterIcon, EyeIcon, TriangleAlert, Clock3, CircleCheckBig, ReceiptText } from "lucide-react";
import type { Ticket, TicketStatus } from "@/types/ticket";
import { HelpdeskTicketDialog } from "@/components/helpdesk-ticket-dialog";

type HelpdeskTab = "all" | "open" | "in_progress" | "resolved";

export function SupportPage() {
  const [activeTab, setActiveTab] = useState<HelpdeskTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<TicketStatus[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading] = useState(false);

  const tickets: Ticket[] = [
    {
      id: "1",
      ticketNumber: "TKT-001",
      user: "Nakato Gloria",
      subject: "Payment not processed for event booking",
      business: "Nightlife Central",
      status: "in_progress",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-16",
      priority: "high",
    },
    {
      id: "2",
      ticketNumber: "TKT-002",
      user: "Kato Brian",
      subject: "Cannot access my business dashboard",
      business: "Cat Walk",
      status: "resolved",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-15",
      priority: "medium",
    },
    {
      id: "3",
      ticketNumber: "TKT-003",
      user: "Nalubwama Sheila",
      subject: "Event not showing up in search",
      business: "Sky Club Kampala",
      status: "resolved",
      createdAt: "2024-01-13",
      updatedAt: "2024-01-14",
      priority: "medium",
    },
    {
      id: "4",
      ticketNumber: "TKT-004",
      user: "Tumusilme Alex",
      subject: "Request for a refund",
      business: "Illusion",
      status: "open",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
      priority: "high",
    },
    {
      id: "5",
      ticketNumber: "TKT-005",
      user: "Mugisha David",
      subject: "Need to update event details",
      business: "Elite Events Co.",
      status: "pending",
      createdAt: "2024-01-11",
      updatedAt: "2024-01-11",
      priority: "low",
    },
  ];

  // Calculate statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const resolvedToday = 42;
  //   const yesterdayResolved = 36;

  // Card data
  const helpdeskCards: CardData[] = useMemo(
    () => [
      {
        title: "Open Tickets",
        value: openTickets.toString(),
        change: {
          description: "Awaiting response",
        },
        rightIcon: <TriangleAlert className="h-4 w-4"/>,
        iconBgColor: "bg-[#92400E]",
      },
      {
        title: "In Progress",
        value: inProgressTickets.toString(),
        change: {
          description: "Being worked on",
        },
        rightIcon: <Clock3 className="h-4 w-4"/>,
        iconBgColor: "bg-[#1E40AF]",
      },
      {
        title: "Resolved Today",
        value: resolvedToday.toString(),
        change: {
          trend: "up" as const,
          value: "18%",
          description: "from yesterday",
        },
        rightIcon: <CircleCheckBig className="h-4 w-4"/>,
        iconBgColor: "bg-[#065F46]",
      },
      {
        title: "Total Tickets",
        value: totalTickets.toString(),
        change: {
          description: "All time",
        },
        rightIcon: <ReceiptText className="h-4 w-4"/>,
        iconBgColor: "bg-[#38119F]",
      },
    ],
    [openTickets, inProgressTickets, resolvedToday, totalTickets]
  );

  // Status options for filter
  const statusOptions: { value: TicketStatus; label: string }[] = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "pending", label: "Pending" },
  ];

  // Filter tickets based on active tab, search query, and selected statuses
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Apply tab filter
    switch (activeTab) {
      case "open":
        filtered = filtered.filter((ticket) => ticket.status === "open");
        break;
      case "in_progress":
        filtered = filtered.filter((ticket) => ticket.status === "in_progress");
        break;
      case "resolved":
        filtered = filtered.filter((ticket) => ticket.status === "resolved");
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedStatuses.includes(ticket.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticketNumber.toLowerCase().includes(query) ||
          ticket.user.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.business.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tickets, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: TicketStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSearchQuery("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const ticketFields = [
    {
      key: "ticketNumber",
      header: "Ticket",
      enableHiding: false,
      cell: (value: unknown, row: Ticket) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{String(value)}</span>
            <span className="text-xs text-muted-foreground">
              Created: {formatDate(row.createdAt)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      cell: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      cell: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "business",
      header: "Business",
      cell: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (value: unknown) => {
        const status = value as TicketStatus;
        const statusConfig = {
          open: {
            label: "Open",
            dotColor: "bg-red-500",
            textColor: "text-red-700",
            bgColor: "bg-red-50",
          },
          in_progress: {
            label: "In Progress",
            dotColor: "bg-yellow-500",
            textColor: "text-yellow-700",
            bgColor: "bg-yellow-50",
          },
          resolved: {
            label: "Resolved",
            dotColor: "bg-green-500",
            textColor: "text-green-700",
            bgColor: "bg-green-50",
          },
          pending: {
            label: "Pending",
            dotColor: "bg-blue-500",
            textColor: "text-blue-700",
            bgColor: "bg-blue-50",
          },
        };

        const config = statusConfig[status] || statusConfig.open;

        return (
          <Badge
            variant="secondary"
            className={`flex flex-row items-center w-28 gap-2 ${config.bgColor} ${config.textColor}`}
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center" as const,
    },
  ];

  const ticketActions = [
    {
      type: "view" as const,
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (row: Ticket) => {
        setSelectedTicket(row);
        setIsDialogOpen(true);
      },
    },
  ];

  const handleStatusChange = (ticket: Ticket, newStatus: Ticket["status"]) => {
    console.log(`Changing status of ${ticket.ticketNumber} to ${newStatus}`);
    // Implement your status change logic here
    // This could update the ticket in your backend
  };

  const handleSendReply = (ticket: Ticket, response: string) => {
    console.log(`Sending reply to ${ticket.ticketNumber}:`, response);
    // Implement your reply sending logic here
    // This could send an email, update the ticket, etc.
  };

  return (
    <div className="min-h-screen">
      <SiteHeader label="Helpdesk Tickets" />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={helpdeskCards} layout="1x4" />

          <div className="space-y-6">
            <div className="rounded-lg border bg-card py-6 mb-6">
              <div className="items-center px-6 mb-8">
                <h2 className="text-2xl font-bold mb-3">Helpdesk Tickets</h2>
                <p className="text-muted-foreground">
                  Manage customer support requests and inquiries
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as HelpdeskTab)}
                className="w-full px-6 bg-transparent rounded-none"
              >
                <TabsList className="grid w-full h-11 grid-cols-4 rounded-none p-0 bg-transparent border-b">
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="open"
                  >
                    Open
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="in_progress"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent h-11 border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="resolved"
                  >
                    Resolved
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full flex-1">
                  <Search
                    placeholder="Search tickets by subject, customer, or ticket number..."
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-full flex"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-12"
                        disabled={loading}
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

                  {/* Clear Filters Button */}
                  {(selectedStatuses.length > 0 || searchQuery) && (
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

              {/* Results Count */}
              <div className="px-6 mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                  {(selectedStatuses.length > 0 || searchQuery) &&
                    " (filtered)"}
                  {loading && " - Loading..."}
                </p>
              </div>

              <DataTable
                data={filteredTickets}
                fields={ticketFields}
                actions={ticketActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={10}
                loading={loading}
                onRowClick={(row) => {
                  console.log("Ticket clicked:", row);
                }}
              />
            </div>
          </div>

          <HelpdeskTicketDialog
            ticket={selectedTicket}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSendReply={handleSendReply}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    </div>
  );
}
