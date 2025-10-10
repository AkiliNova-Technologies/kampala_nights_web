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
  // EyeIcon,
  TrashIcon,
  PenIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { BusinessStatusDialog } from "@/components/update-business-status";
import { DeleteBusinessDialog } from "@/components/delete-business-dialog";
import type { Business } from "@/types/business";
import { useReduxBusiness } from "@/hooks/useReduxBusiness";
import { useReduxAuth } from "@/hooks/UseReduxAuth";
import { toast } from "sonner"; // Optional: for notifications

export function DashboardHome() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updatingBusinessId, setUpdatingBusinessId] = useState<string | null>(null);

  const {
    businesses: businessData,
    loading,
    error,
    fetchBusinesses,
    updateBusinessData
  } = useReduxBusiness();
  const { isAuthenticated, token } = useReduxAuth();

  useEffect(() => {
    console.log("🔍 Debug: useEffect triggered", {
      isAuthenticated,
      hasToken: !!token,
      businessDataLength: businessData?.length,
      loading,
    });

    if (isAuthenticated && token) {
      console.log("🔄 Fetching businesses...", {
        token: token.substring(0, 20) + "...",
      });
      fetchBusinesses({ page: 1, limit: 50 });
    } else {
      console.log("❌ Cannot fetch: Missing auth", {
        isAuthenticated,
        hasToken: !!token,
      });
    }
  }, [fetchBusinesses, isAuthenticated, token]);

  useEffect(() => {
    console.log("📊 Business Data State:", {
      loading,
      error,
      businessDataCount: businessData?.length,
      businessData: businessData ? "Available" : "Null/Undefined",
    });

    if (error) {
      console.error("❌ Detailed error:", error);
    }
  }, [loading, error, businessData]);

  const transformedBusinessData: Business[] =
    businessData?.map((business: any, index: number) => ({
      id: business.id || business._id || `temp-${index + 1}`,
      business:
        business.businessName || business.name || `Business ${index + 1}`,
      owner:
        business.owner?.firstName && business.owner?.lastName
          ? `${business.owner.firstName} ${business.owner.lastName}`
          : business.owner?.email || business.contactPerson || "Unknown Owner",
      registrationDate: business.createdAt
        ? new Date(business.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown date",
      status: mapApiStatusToBusinessStatus(
        business.status || business.approvalStatus
      ),
      address:
        business.address?.streetAddress ||
        business.location ||
        "No address provided",
      image: business.logo || business.image || `/api/placeholder/40/40`,
    })) || [];

  function mapApiStatusToBusinessStatus(apiStatus: string): Business["status"] {
    const statusMap: Record<string, Business["status"]> = {
      pending: "pending",
      approved: "approved",
      active: "approved",
      cancelled: "cancelled",
      rejected: "cancelled",
      inactive: "cancelled",
      suspended: "cancelled",
    };

    return statusMap[apiStatus?.toLowerCase()] || "pending";
  }

  // Helper function to map Business status back to API status
  function mapBusinessStatusToApiStatus(businessStatus: Business["status"]): string {
    const statusMap: Record<Business["status"], string> = {
      pending: "pending",
      approved: "approved",
      cancelled: "cancelled",
      suspended: "suspended"
    };
    return statusMap[businessStatus] || "pending";
  }

  const dashboardCards: CardData[] = [
    {
      icon: <BuildingIcon className="size-4" />,
      iconBgColor: "bg-blue-500",
      title: "Total Businesses",
      value: transformedBusinessData.length.toString(),
      change: {
        value: "12%",
        trend: "up",
        description: "from last month",
      },
    },
    {
      icon: <CalendarIcon className="size-4" />,
      iconBgColor: "bg-purple-500",
      title: "Events This Month",
      value: "35k",
      change: {
        value: "23%",
        trend: "up",
        description: "from last month",
      },
    },
    {
      icon: <DollarSignIcon className="size-4" />,
      iconBgColor: "bg-green-500",
      title: "Platform Revenue",
      value: "$2.4M",
      change: {
        value: "15%",
        trend: "up",
        description: "from last month",
      },
    },
    {
      icon: <UsersIcon className="size-4" />,
      iconBgColor: "bg-orange-500",
      title: "Total Users",
      value: "89,432",
      change: {
        value: "5%",
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

  const handleStatusUpdate = async (
    businessId: string,
    newStatus: Business["status"]
  ) => {
    try {
      setUpdatingBusinessId(businessId);
      
      console.log(`🔄 Updating business ${businessId} to status: ${newStatus}`);
      
      // Map the Business status to API status
      const apiStatus = mapBusinessStatusToApiStatus(newStatus);
      
      // Prepare the update data based on your API requirements
      const updateData = {
        status: apiStatus,
        isActive: newStatus === "approved", 
        isVerified: newStatus === "approved",
      };

      await updateBusinessData(businessId, updateData);
      
      console.log(`✅ Successfully updated business ${businessId} to ${newStatus}`);
      
      toast.success(`Business status updated to ${newStatus}`);
      
      fetchBusinesses({ page: 1, limit: 50, forceRefresh: true });
      
    } catch (error) {
      console.error(`❌ Failed to update business ${businessId}:`, error);
      
      // Show error message
      toast.error("Failed to update business status");
    } finally {
      setUpdatingBusinessId(null);
      setIsStatusDialogOpen(false);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      console.log(`🗑️ Deleting business: ${businessId}`);
      
      // TODO: Implement actual delete API call
      // For now, just show a message
      toast.success("Business deleted successfully");
      
      // Refresh the businesses list
      fetchBusinesses({ page: 1, limit: 50, forceRefresh: true });
      
    } catch (error) {
      console.error(`❌ Failed to delete business ${businessId}:`, error);
      toast.error("Failed to delete business");
    } finally {
      setIsDeleteDialogOpen(false);
    }
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
      header: "Owner",
      cell: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "registrationDate",
      header: "Date Of Registration",
    },
    {
      key: "status",
      header: "Status ↓",
      cell: (value, row) => {
        const statusConfig = {
          pending: {
            label: "Pending",
            dotColor: "bg-gray-500",
          },
          approved: {
            label: "Approved",
            dotColor: "bg-green-500",
          },
          cancelled: {
            label: "Cancelled",
            dotColor: "bg-red-500",
          },
        };

        const config = statusConfig[value as keyof typeof statusConfig];
        const isUpdating = updatingBusinessId === row.id;

        return (
          <Badge
            variant="secondary"
            className="flex flex-row items-center w-26 gap-2 bg-muted/50"
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500" />
            ) : (
              <div className={`size-2 rounded-full ${config.dotColor}`} />
            )}
            {isUpdating ? "Updating..." : config.label}
          </Badge>
        );
      },
      align: "center",
      enableSorting: true,
    },
  ];

  const businessActions: TableAction<Business>[] = [
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
            <div className="rounded-lg border bg-card py-6 mb-6">
              <DataTable<Business>
                title="Recent Business Applications"
                description="Latest businesses requesting to join the platform"
                data={transformedBusinessData}
                fields={businessFields}
                actions={businessActions}
                enableSelection={true}
                enablePagination={true}
                pageSize={5}
                loading={loading}
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