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
import { useReduxBusiness } from "@/hooks/useReduxBusiness";
import type { BusinessUser } from "@/types/business";
import { EyeIcon, FilterIcon, PenIcon, TrashIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// FIX 1: Update types to match your Redux slice
type BusinessStatusTab = "all" | "pending" | "active";

// FIX 2: Create a mapped type that matches your UI needs
type UIBusiness = {
  id: string;
  business: string; // companyName
  owner: string; // firstName + lastName
  registrationDate: string; // You might need to calculate this
  status: "PENDING" | "APPROVED" | "REJECTED";
  address: string;
  image?: string;
  originalData: BusinessUser;
  isActive: string;
  isVerified: string;
};

export function BusinessesPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<UIBusiness | null>(
    null
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BusinessStatusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<
    UIBusiness["status"][]
  >([]);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const {
    businesses: businessData,
    loading,
    fetchBusinesses,
    hasData,
  } = useReduxBusiness();

  useEffect(() => {
    // Only fetch if no data and haven't fetched yet
    if (!hasData && !hasFetchedInitialData && !loading) {
      console.log("🔄 Fetching businesses for BusinessesPage...");
      fetchBusinesses({ page: 1, limit: 50 });
      setHasFetchedInitialData(true);
    }
  }, [fetchBusinesses, hasData, hasFetchedInitialData, loading]);

  // Only show loading when we have no data AND are loading
  const showLoading = loading && !hasData;

  const navigate = useNavigate();

  // In the mappedBusinesses useMemo, replace the status logic:
  const mappedBusinesses: UIBusiness[] = useMemo(() => {
    return businessData.map((business): UIBusiness => {
      // Use the businessAccount.status directly from API
      let status: UIBusiness["status"] = business.businessAccount.status as
        | "PENDING"
        | "APPROVED"
        | "REJECTED";

      const registrationDate = business.businessAccount.verifiedAt
        ? new Date(business.businessAccount.verifiedAt).toLocaleDateString()
        : "Not verified";

      return {
        id: business.id,
        business: business.businessAccount.companyName,
        owner: `${business.firstName} ${business.lastName}`,
        registrationDate,
        status,
        address: business.businessAccount.address,
        image: undefined,
        originalData: business,
        // Add these if you need them separately
        isActive: business.isActive ? "Active" : "Inactive",
        isVerified: business.businessAccount.isVerified
          ? "Verified"
          : "Not Verified",
      };
    });
  }, [businessData]);

  // Available status options for filter
  const statusOptions: { value: UIBusiness["status"]; label: string }[] = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
  ];

  // Filter businesses based on active tab, search query, and selected statuses
  const filteredBusinesses = useMemo(() => {
    let filtered = mappedBusinesses;

    // First apply tab filter
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((business) => business.status === "PENDING");
        break;
      case "active":
        filtered = filtered.filter(
          (business) => business.status === "APPROVED"
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
          business.business.toLowerCase().includes(query) ||
          business.address?.toLowerCase().includes(query) ||
          business.owner.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [mappedBusinesses, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: UIBusiness["status"]) => {
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

  // FIX 5: Update card data calculation
  const businessCards: CardData[] = [
    {
      title: "Total Businesses",
      value: mappedBusinesses.length.toString(),
      change: {
        description: "from last month",
      },
    },
    {
      title: "Active Businesses",
      value: mappedBusinesses
        .filter((b) => b.status === "APPROVED")
        .length.toString(),
      change: {
        description: "of total businesses",
      },
    },
    {
      title: "Pending Applications",
      value: mappedBusinesses
        .filter((b) => b.status === "PENDING")
        .length.toString(),
      change: {
        description: "Awaiting review",
      },
    },
    {
      title: "Total Revenue",
      value: "0",
      change: {
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

  // FIX 6: Update handlers to work with actual API data
  const handleStatusUpdate = (
    businessId: string,
    newStatus: UIBusiness["status"]
  ) => {
    const originalBusiness = mappedBusinesses.find(
      (b) => b.id === businessId
    )?.originalData;

    if (originalBusiness) {
      const updates = {
        status: newStatus,
        isVerified: newStatus === "APPROVED",
        isActive: newStatus === "APPROVED",
      };

      console.log(
        `Updated business ${businessId} to status: ${newStatus}`,
        updates
      );
    }
  };

  const handleDeleteBusiness = (businessId: string) => {
    // TODO: Implement actual delete API call
    console.log(`Deleted business: ${businessId}`);
  };

  const handleEditClick = (business: UIBusiness) => {
    setSelectedBusiness(business);
    setIsStatusDialogOpen(true);
  };

  const handleDeleteClick = (business: UIBusiness) => {
    setSelectedBusiness(business);
    setIsDeleteDialogOpen(true);
  };

  // FIX 7: Update table fields to use UIBusiness type
  const businessFields: TableField<UIBusiness>[] = [
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
          PENDING: {
            label: "Pending",
            dotColor: "bg-yellow-500",
          },
          APPROVED: {
            label: "Approved",
            dotColor: "bg-green-500",
          },
          REJECTED: {
            label: "Rejected",
            dotColor: "bg-red-500",
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] ||
          statusConfig.PENDING;

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

  const businessActions: TableAction<UIBusiness>[] = [
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

              <div className="px-6">
                <DataTable<UIBusiness>
                  data={filteredBusinesses}
                  fields={businessFields}
                  actions={businessActions}
                  enableSelection={true}
                  enablePagination={true}
                  pageSize={10}
                  loading={showLoading}
                  onRowClick={(business) => {
                    console.log("Row clicked:", business);
                  }}
                />
              </div>
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
