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
import { useState } from "react";
import { BusinessStatusDialog } from "@/components/update-business-status";
import { DeleteBusinessDialog } from "@/components/delete-business-dialog";
import type { Business } from "@/types/business";

export function DashboardHome() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Define businessData as state so we can update it
  const [businessData, setBusinessData] = useState<Business[]>([
    {
      id: 1,
      business: "Nightlife Central Kōolo",
      owner: "Nicholas Patrick",
      registrationDate: "4 days ago",
      status: "pending",
      address: "Kampala Road, Kōolo",
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      business: "Illusion Nakasero",
      owner: "Olivia Smith",
      registrationDate: "Sep 12, 2025",
      status: "approved",
      address: "Nakasero Hill",
      image: "/api/placeholder/40/40",
    },
    {
      id: 3,
      business: "Cat Walk Kabalagala",
      owner: "Mike Wilson",
      registrationDate: "Sep 12, 2025",
      status: "cancelled",
      address: "Kabalagala Road",
    },
    {
      id: 4,
      business: "Sky Lounge Kololo",
      owner: "Sarah Johnson",
      registrationDate: "Sep 10, 2025",
      status: "pending",
      address: "Kololo Heights",
      image: "/api/placeholder/40/40",
    },
    {
      id: 5,
      business: "Bassline Bukoto",
      owner: "David Brown",
      registrationDate: "Sep 8, 2025",
      status: "approved",
      address: "Bukoto Street",
    },
    {
      id: 6,
      business: "Velvet Room Muyenga",
      owner: "Jennifer Lee",
      registrationDate: "Sep 5, 2025",
      status: "pending",
      address: "Muyenga Tank Hill",
      image: "/api/placeholder/40/40",
    },
  ]);

  const dashboardCards: CardData[] = [
    {
      icon: <BuildingIcon className="size-4" />,
      iconBgColor: "bg-blue-500",
      title: "Total Businesses",
      value: "20K",
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

  // Helper function to get initials from business name
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
    // Update business status in the local state
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
    // Remove business from the local state
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
      cell: (value) => {
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
      type: "edit",
      label: "Edit Status",
      icon: <PenIcon className="size-5 text-[#8C8C8C]" />,
      onClick: handleEditClick,
    },
    {
      type: "delete",
      label: "Delete Business",
      icon: <TrashIcon className="size-5 text-[#8C8C8C]" />,
      onClick: handleDeleteClick,
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
                data={businessData}
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

          {/* Status Update Dialog */}
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
      </main>
    </div>
  );
}
