import {
  DataTable,
  type TableAction,
  type TableField,
} from "@/components/data-table";
import { DeleteBusinessDialog } from "@/components/delete-business-dialog";
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
import { BusinessStatusDialog } from "@/components/update-business-status";
import type { Business } from "@/types/business";
import {
  EyeIcon,
  FilterIcon,
  PenIcon,
  TrashIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type BusinessStatusTab = "all" | "pending" | "active";

export function BusinessesPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BusinessStatusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<
    Business["status"][]
  >([]);

  const [businessData, setBusinessData] = useState<Business[]>([
    {
      id: 1,
      business: "Nightlife Central",
      owner: "Nicholas Patrick",
      registrationDate: "4 days ago",
      status: "pending",
      address: "Kololo",
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      business: "Illusion",
      owner: "Olivia Smith",
      registrationDate: "Sep 12, 2025",
      status: "approved",
      address: "Nakasero",
      image: "/api/placeholder/40/40",
    },
    {
      id: 3,
      business: "Cat Walk",
      owner: "Mike Wilson",
      registrationDate: "Sep 12, 2025",
      status: "approved",
      address: "Kabalagala",
    },
    {
      id: 4,
      business: "Sky Club Kampala",
      owner: "Lisa Chen",
      registrationDate: "Aug 2, 2025",
      status: "suspended",
      address: "Industrial Area",
      image: "/api/placeholder/40/40",
    },
    {
      id: 5,
      business: "Elite Events Co",
      owner: "Eve Nalugya",
      registrationDate: "Aug 12, 2025",
      status: "pending",
      address: "Bugolobi",
    },
    {
      id: 6,
      business: "Sky Lounge Kololo",
      owner: "Sarah Johnson",
      registrationDate: "Sep 10, 2025",
      status: "pending",
      address: "Kololo Heights",
      image: "/api/placeholder/40/40",
    },
    {
      id: 7,
      business: "Bassline Bukoto",
      owner: "David Brown",
      registrationDate: "Sep 8, 2025",
      status: "approved",
      address: "Bukoto Street",
    },
    {
      id: 8,
      business: "Velvet Room Muyenga",
      owner: "Jennifer Lee",
      registrationDate: "Sep 5, 2025",
      status: "pending",
      address: "Muyenga Tank Hill",
      image: "/api/placeholder/40/40",
    },
  ]);

  const navigate = useNavigate();

  // Available status options for filter
  const statusOptions: { value: Business["status"]; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "suspended", label: "Suspended" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Filter businesses based on active tab, search query, and selected statuses
  const filteredBusinesses = useMemo(() => {
    let filtered = businessData;

    // First apply tab filter
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((business) => business.status === "pending");
        break;
      case "active":
        filtered = filtered.filter(
          (business) => business.status === "approved"
        );
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Then apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((business) =>
        selectedStatuses.includes(business.status)
      );
    }

    // Finally apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (business) =>
          // Search through business name, address, owner (manager), and email
          business.business.toLowerCase().includes(query) ||
          business.address?.toLowerCase().includes(query) ||
          business.owner.toLowerCase().includes(query) ||
          // You can add more searchable fields here
          false
      );
    }

    return filtered;
  }, [businessData, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: Business["status"]) => {
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

  const businessCards: CardData[] = [
    {
      title: "Total Businesses",
      value: businessData.length.toString(),
      change: {
        value: "5%",
        trend: "up",
        description: "from last month",
      },
    },
    {
      title: "Active Businesses",
      value: businessData
        .filter((b) => b.status === "approved")
        .length.toString(),
      change: {
        value: "2%",
        trend: "up",
        description: "of total businesses",
      },
    },
    {
      title: "Pending Applications",
      value: businessData
        .filter((b) => b.status === "pending")
        .length.toString(),
      change: {
        value: "2%",
        trend: "up",
        description: "Awaiting review",
      },
    },
    {
      title: "Total Revenue",
      value: "$2.4M",
      change: {
        value: "15%",
        trend: "up",
        description: "from last month",
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

  const handleStatusUpdate = (
    businessId: number,
    newStatus: Business["status"]
  ) => {
    setBusinessData((prevData) =>
      prevData.map((business) =>
        business.id === businessId
          ? { ...business, status: newStatus }
          : business
      )
    );
    console.log(`Updated business ${businessId} to status: ${newStatus}`);
  };

  const handleDeleteBusiness = (businessId: number) => {
    setBusinessData((prevData) =>
      prevData.filter((business) => business.id !== businessId)
    );
    console.log(`Deleted business: ${businessId}`);
  };

  const handleEditClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsStatusDialogOpen(true);
  };

  const handleDeleteClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsDeleteDialogOpen(true);
  };

  const businessFields: TableField<Business>[] = [
    {
      key: "business",
      header: "Business",
      enableHiding: false,
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={row.image} alt={row.business} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(row.business)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.business}</span>
            <span className="text-xs text-muted-foreground">
              {row.address || "No address provided"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Manager",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "registrationDate",
      header: "Last Active",
    },
    {
      key: "status",
      header: "Status ↓",
      cell: (value) => {
        const statusConfig = {
          pending: {
            label: "Pending",
            dotColor: "bg-yellow-500",
          },
          approved: {
            label: "Approved",
            dotColor: "bg-green-500",
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-red-500",
          },
          suspended: {
            label: "Suspended",
            dotColor: "bg-red-500",
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] ||
          statusConfig.pending;

        return (
          <Badge
            variant="secondary"
            className="flex flex-row items-center w-26 gap-2 bg-muted/50"
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

  const businessActions: TableAction<Business>[] = [
    {
      type: "view",
      label: "View Details",
      icon: <EyeIcon className="size-5" />,
      onClick: (business) => {
        console.log("View business:", business);
        navigate(`/admin/businesses/profile`);
      },
    },
    {
      type: "edit",
      label: "Edit Status",
      icon: <PenIcon className="size-5" />,
      onClick: handleEditClick,
    },
    {
      type: "delete",
      label: "Delete Business",
      icon: <TrashIcon className="size-5" />,
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={businessCards} />

          <div className="space-y-6">
            {/* Recent Business Applications Section */}
            <div className="rounded-lg border bg-card py-6 mb-6">
              <div className="px-6 mb-4 space-y-1">
                <h2 className="font-bold">All Businesses</h2>
                <p>Manage and monitor all businesses on the platform</p>
              </div>

              {/* Tabs for filtering businesses */}
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as BusinessStatusTab)
                }
                className="px-6 w-full bg-transparent rounded-none"
              >
                <TabsList className="grid w-full max-w-full grid-cols-3 rounded-none p-0 bg-transparent border-b h-10">
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent h-10"
                    value="all"
                  >
                    All Businesses
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent h-10"
                    value="pending"
                  >
                    Pending Businesses
                  </TabsTrigger>
                  <TabsTrigger
                    className="bg-transparent border-0 rounded-none data-[state=active]:border-b-1 data-[state=active]:border-[#5014D0] data-[state=active]:text-[#5014D0] data-[state=active]:shadow-none data-[state=active]:dark:border-[#5014D0] data-[state=active]:dark:text-[#5014D0] data-[state=active]:dark:bg-transparent h-10"
                    value="active"
                  >
                    Active Businesses
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0"></TabsContent>
                <TabsContent value="pending" className="mt-0"></TabsContent>
                <TabsContent value="active" className="mt-0"></TabsContent>
              </Tabs>

              {/* Search and Filter Section */}
              <div className="px-6 mt-6 flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
                <div className="w-full">
                  <Search
                    placeholder="Search business name, address, manager..."
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    className="rounded-md"
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
                  Showing {filteredBusinesses.length} of {businessData.length}{" "}
                  businesses
                  {(selectedStatuses.length > 0 || searchQuery) &&
                    " (filtered)"}
                </p>
              </div>

              <DataTable<Business>
                data={filteredBusinesses}
                fields={businessFields}
                actions={businessActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
                onRowClick={(business) => {
                  console.log("Row clicked:", business);
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <BusinessStatusDialog
        business={selectedBusiness}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />

      <DeleteBusinessDialog
        business={selectedBusiness}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteBusiness}
      />
    </div>
  );
}
