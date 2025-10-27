import { PlatformActivityChart } from "@/components/PlatformActivityChart";
import { SectionCards, type CardData } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import {
  DataTable,
  type TableField,
  type TableAction,
} from "@/components/data-table";
import {
  BuildingIcon,
  CalendarIcon,
  DollarSignIcon,
  UsersIcon,
  TrashIcon,
  PenIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useMemo } from "react";
import { BusinessStatusDialog } from "@/components/update-business-status";
import { DeleteBusinessDialog } from "@/components/delete-business-dialog";
import type { BusinessUser } from "@/types/business";
import { useReduxBusiness } from "@/hooks/useReduxBusiness";
import { useReduxAuth } from "@/hooks/UseReduxAuth";
import { toast } from "sonner";

type UIBusiness = {
  id: string;
  business: string;
  owner: string;
  registrationDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  address: string;
  image?: string;
  originalData: BusinessUser;
};

export function DashboardHome() {
  const [updatingBusinessId, setUpdatingBusinessId] = useState<string | null>(
    null
  );
  const { isAuthenticated, token } = useReduxAuth();
  const [selectedBusiness, setSelectedBusiness] = useState<UIBusiness | null>(
    null
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery] = useState("");
  const [selectedStatuses] = useState<UIBusiness["status"][]>([]);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);

  const {
    businesses: businessData,
    loading,
    fetchBusinesses,
    updateBusinessStatus,
    hasData,
  } = useReduxBusiness();

  // Combined data fetching effect
  useEffect(() => {
    console.log("🔍 Debug: useEffect triggered", {
      isAuthenticated,
      hasToken: !!token,
      businessDataLength: businessData?.length,
      loading,
      hasFetchedInitialData,
      hasData,
    });

    if (
      isAuthenticated &&
      token &&
      !hasData &&
      !hasFetchedInitialData &&
      !loading
    ) {
      console.log("🔄 Fetching businesses...");
      fetchBusinesses({ page: 1, limit: 50 });
      setHasFetchedInitialData(true);
    }
  }, [
    fetchBusinesses,
    isAuthenticated,
    token,
    hasData,
    hasFetchedInitialData,
    loading,
  ]);

  const showLoading = loading && !hasData;

  const mappedBusinesses: UIBusiness[] = useMemo(() => {
    return businessData.map((business): UIBusiness => {
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
      };
    });
  }, [businessData]);

  // Filter businesses based on selected statuses and search query
  const filteredBusinesses = useMemo(() => {
    let filtered = mappedBusinesses;

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((business) =>
        selectedStatuses.includes(business.status)
      );
    }

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
  }, [mappedBusinesses, selectedStatuses, searchQuery]);

  const dashboardCards: CardData[] = [
    {
      icon: <BuildingIcon className="size-4" />,
      iconBgColor: "bg-blue-500",
      title: "Total Businesses",
      value: mappedBusinesses.length.toString(),
      change: {
        description: "from last month",
      },
    },
    {
      icon: <CalendarIcon className="size-4" />,
      iconBgColor: "bg-purple-500",
      title: "Approved Businesses",
      value: mappedBusinesses
        .filter((b) => b.status === "APPROVED")
        .length.toString(),
      change: {
        description: "active on platform",
      },
    },
    {
      icon: <DollarSignIcon className="size-4" />,
      iconBgColor: "bg-green-500",
      title: "Pending Review",
      value: mappedBusinesses
        .filter((b) => b.status === "PENDING")
        .length.toString(),
      change: {
        description: "awaiting approval",
      },
    },
    {
      icon: <UsersIcon className="size-4" />,
      iconBgColor: "bg-orange-500",
      title: "Rejected Businesses",
      value: mappedBusinesses
        .filter((b) => b.status === "REJECTED")
        .length.toString(),
      change: {
        description: "not approved",
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

  const handleStatusUpdate = async (
    businessId: string,
    newStatus: UIBusiness["status"]
  ) => {
    try {
      setUpdatingBusinessId(businessId);

      console.log(`🔄 Updating business ${businessId} to status: ${newStatus}`);

      // Map the UI status to backend action
      const backendAction =
        newStatus === "APPROVED"
          ? "APPROVED"
          : newStatus === "REJECTED"
          ? "REJECTED"
          : "PENDING";
      const notes = `Status changed to ${newStatus}`;

      await updateBusinessStatus(businessId, backendAction, notes);

      console.log(`✅ Successfully updated business ${businessId}`);

      toast.success(
        `Business status updated to ${newStatus.toLowerCase()} successfully`
      );

      fetchBusinesses({ page: 1, limit: 50, forceRefresh: true });
    } catch (error) {
      console.error(`❌ Failed to update business ${businessId}:`, error);
      toast.error("Failed to update business status");
    } finally {
      setUpdatingBusinessId(null);
      setIsStatusDialogOpen(false);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      console.log(`🗑️ Deleting business: ${businessId}`);
      toast.success("Business deleted successfully");
      fetchBusinesses({ page: 1, limit: 50, forceRefresh: true });
    } catch (error) {
      console.error(`❌ Failed to delete business ${businessId}:`, error);
      toast.error("Failed to delete business");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditClick = (business: UIBusiness) => {
    setSelectedBusiness(business);
    setIsStatusDialogOpen(true);
  };

  const handleDeleteClick = (business: UIBusiness) => {
    setSelectedBusiness(business);
    setIsDeleteDialogOpen(true);
  };

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
      type: "edit",
      label: "Edit Status",
      icon: <PenIcon className="size-5 text-[#8C8C8C]" />,
      onClick: handleEditClick,
      disabled: (business) => updatingBusinessId === business.id,
    },
    {
      type: "delete",
      label: "Delete Business",
      icon: <TrashIcon className="size-5 text-[#8C8C8C]" />,
      onClick: handleDeleteClick,
      disabled: (business) => updatingBusinessId === business.id,
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="space-y-6 p-6">
          <SectionCards cards={dashboardCards} />

          <div className="space-y-6">
            <PlatformActivityChart />

            {/* Recent Business Applications Section */}
            <div className="rounded-lg border bg-card p-6 mb-6">
              <DataTable<UIBusiness>
                title="Recent Business Applications"
                description="Latest businesses requesting to join the platform"
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

          {/* Status Update Dialog */}
          <BusinessStatusDialog
            business={selectedBusiness}
            isOpen={isStatusDialogOpen}
            onClose={() => setIsStatusDialogOpen(false)}
            onStatusUpdate={handleStatusUpdate}
            loading={updatingBusinessId === selectedBusiness?.id}
          />

          <DeleteBusinessDialog
            business={selectedBusiness}
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDelete={handleDeleteBusiness}
          />
        </div>
      </main>
    </div>
  );
}
