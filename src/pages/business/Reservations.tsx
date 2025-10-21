// pages/reservations-page.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, type TableAction, type TableField } from "@/components/data-table";
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
import type { Reservation, ReservationStatus, ReservationTab } from "@/types/reservation";
import { useReservations } from "@/hooks/useReservations";

import { EyeIcon, FilterIcon } from "lucide-react";

export function ReservationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReservationTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<ReservationStatus[]>([]);

  const {
    useFilteredReservations,
    getReservationStats
  } = useReservations();

  const filteredReservations = useFilteredReservations(activeTab, searchQuery, selectedStatuses);
  const stats = getReservationStats();

  // Available status options for filter
  const statusOptions: { value: ReservationStatus; label: string }[] = [
    { value: "attended", label: "Attended" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
    { value: "pending", label: "Pending" },
  ];

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

  const formatMoneyShort = (amount: number): string => {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 2)}M`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 2)}K`;
    }
    return amount.toString();
  };

  const reservationCards: CardData[] = [
    {
      title: "Total Reservations",
      value: stats.total.toString(),
      change: {
        trend: "up",
        value: "12%",
        description: "from last month",
      },
    },
    {
      title: "Total Revenue",
      value: `UGX ${formatMoneyShort(stats.totalRevenue)}`,
      change: {
        trend: "up",
        value: "18%",
        description: "from last month",
      },
    },
    {
      title: "Attended",
      value: stats.attended.toString(),
      change: {
        description: `${stats.attendanceRate.toFixed(1)}% attendance rate`,
      },
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      change: {
        description: "Awaiting payment or confirmation",
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
    return `UGX ${amount.toLocaleString("en-US")}`;
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
      header: "Amount",
      cell: (value) => (
        <span className="font-medium">{formatAmount(value as number)}</span>
      ),
      align: "right",
    },
    {
      key: "guests",
      header: "Guests",
      cell: (value) => (
        <span className="font-medium">{value as number}</span>
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
            textColor: "text-green-700",
            bgColor: "bg-green-50"
          },
          paid: {
            label: "Paid",
            dotColor: "bg-blue-500",
            textColor: "text-blue-700",
            bgColor: "bg-blue-50"
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-red-500",
            textColor: "text-red-700",
            bgColor: "bg-red-50"
          },
          pending: {
            label: "Pending",
            dotColor: "bg-yellow-500",
            textColor: "text-yellow-700",
            bgColor: "bg-yellow-50"
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] || statusConfig.pending;

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
        navigate(`/business/reservations/${reservation.id}/view`);
      },
    },
  ];


  return (
    <div className="min-h-screen">
      <SiteHeader label="Reservations Dashboard"/>
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
                <TabsList className="grid w-full max-w-full grid-cols-5 rounded-none p-0 bg-transparent border-b">
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
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent"
                    value="pending"
                  >
                    Pending
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0"></TabsContent>
                <TabsContent value="attended" className="mt-0"></TabsContent>
                <TabsContent value="paid" className="mt-0"></TabsContent>
                <TabsContent value="cancelled" className="mt-0"></TabsContent>
                <TabsContent value="pending" className="mt-0"></TabsContent>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
                <div className="w-full">
                  <Search
                    placeholder="Search by events, name, phone, or email..."
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

              <DataTable<Reservation>
                data={filteredReservations}
                fields={reservationFields}
                actions={reservationActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}