import {
  DataTable,
  type TableAction,
  type TableField,
} from "@/components/data-table";

import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Reservation,
  ReservationStatus,
  ReservationTab,
} from "@/types/reservation";

import { EyeIcon, FilterIcon } from "lucide-react";
import { useState, useMemo } from "react";

export function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<ReservationTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<ReservationStatus[]>(
    []
  );

  const [reservationData] = useState<Reservation[]>([
    {
      id: 1,
      customer: "Nakato Gloria",
      phone: "+256 700 123 456",
      event: "Saturday Night Vibes",
      amount: 150000,
      dateTime: "Oct, 25, 2025 20:00",
      status: "attended",
    },
    {
      id: 2,
      customer: "Kato Brian",
      phone: "+256 700 234 567",
      event: "Wine & Rhymes Night",
      amount: 387000,
      dateTime: "Oct, 25, 2025 20:00",
      status: "paid",
    },
    {
      id: 3,
      customer: "Nalubwama Sheila",
      phone: "+256 700 345 678",
      event: "Amapiano Kasiki",
      amount: 500000,
      dateTime: "Oct, 29, 2025 22:00",
      status: "paid",
    },
    {
      id: 4,
      customer: "Tumusilme Alex",
      phone: "+256 700 456 789",
      event: "Rooftop Sundowner",
      amount: 156000,
      dateTime: "Oct, 25, 2025 20:00",
      status: "cancelled",
    },
    {
      id: 5,
      customer: "Mugisha David",
      phone: "+256 700 567 890",
      event: "Nile Reggae Festival",
      amount: 275000,
      dateTime: "Oct, 25, 2025 20:00",
      status: "cancelled",
    },
  ]);

  // Available status options for filter
  const statusOptions: { value: ReservationStatus; label: string }[] = [
    { value: "attended", label: "Attended" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Filter reservations based on active tab, search query, and selected statuses
  const filteredReservations = useMemo(() => {
    let filtered = reservationData;

    // Apply tab filter
    switch (activeTab) {
      case "attended":
        filtered = filtered.filter(
          (reservation) => reservation.status === "attended"
        );
        break;
      case "paid":
        filtered = filtered.filter(
          (reservation) => reservation.status === "paid"
        );
        break;
      case "cancelled":
        filtered = filtered.filter(
          (reservation) => reservation.status === "cancelled"
        );
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((reservation) =>
        selectedStatuses.includes(reservation.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (reservation) =>
          reservation.customer.toLowerCase().includes(query) ||
          reservation.event.toLowerCase().includes(query) ||
          reservation.phone.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [reservationData, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: ReservationStatus) => {
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

  const reservationCards: CardData[] = [
    {
      title: "Total Reservations",
      value: "64",
      change: {
        trend: "up",
        value: "20%",
        description: "from last month",
      },
    },
    {
      title: "Total Check Ins",
      value: "34",
      change: {
        description: "Check-Ins via app",
      },
    },
    {
      title: "Attended",
      value: "30",
      change: {
        description: "Headcount across events",
      },
    },
    {
      title: "Attendance Rate",
      value: "50%",
      change: {
        description: "From all events",
      },
    },
  ];

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-US");
  };

  const reservationFields: TableField<Reservation>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={row.image} alt={row.customer} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(row.customer)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.customer}</span>
            <span className="text-xs text-muted-foreground">{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "event",
      header: "Event",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "amount",
      header: "Amount (UGX)",
      cell: (value) => (
        <span className="font-medium">{formatAmount(value as number)}</span>
      ),
      align: "right",
    },
    {
      key: "dateTime",
      header: "Date & Time",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (value) => {
        const statusConfig = {
          attended: {
            label: "Attended",
            dotColor: "bg-green-500",
          },
          paid: {
            label: "Paid",
            dotColor: "bg-blue-500",
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-red-500",
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] || statusConfig.paid;

        return (
          <Badge
            variant="secondary"
            className="flex flex-row items-center w-24 gap-2 bg-muted/50"
          >
            <div className={`size-2 rounded-full ${config.dotColor}`} />
            {config.label}
          </Badge>
        );
      },
      align: "center",
      enableSorting: true,
    },
  ];

  const reservationActions: TableAction<Reservation>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (reservation) => {
        console.log("View reservation details:", reservation);
        // Navigate to reservation details page
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={reservationCards} layout="1x4" />

          <div className="space-y-6">
            {/* Reservations Section */}
            <div className="rounded-lg border bg-card py-6 mb-6">
              {/* Tabs for filtering reservations by status */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as ReservationTab)}
                className="px-6 w-full bg-transparent rounded-none"
              >
                <TabsList className="grid w-full max-w-full grid-cols-4 rounded-none p-0 bg-transparent border-b">
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="all"
                  >
                    All Status
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="attended"
                  >
                    Attended
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="paid"
                  >
                    Paid
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="cancelled"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0"></TabsContent>
                <TabsContent value="attended" className="mt-0"></TabsContent>
                <TabsContent value="paid" className="mt-0"></TabsContent>
                <TabsContent value="cancelled" className="mt-0"></TabsContent>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
                <div className="w-full">
                  <Search
                    placeholder="Search by events, or name..."
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-full"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  {/* Status Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-12"
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
                  Showing {filteredReservations.length} of{" "}
                  {reservationData.length} reservations
                  {(selectedStatuses.length > 0 || searchQuery) &&
                    " (filtered)"}
                </p>
              </div>

              <DataTable<Reservation>
                data={filteredReservations}
                fields={reservationFields}
                actions={reservationActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
                onRowClick={(reservation) => {
                  console.log("Reservation clicked:", reservation);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
