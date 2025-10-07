import {
  DataTable,
  type TableAction,
  type TableField,
} from "@/components/data-table";
import { DeleteUserDialog } from "@/components/delete-user-dialog";
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
import type { User, UserStatus } from "@/types/user";
import {
  Calculator,
  Crown,
  FilterIcon,
  HeadsetIcon,
  PenIcon,
  PlusIcon,
  Shield,
  TrashIcon,
  Users,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";


type UserRoleTab = "all" | "super-admins" | "admins" | "operations" | "marketing" | "helpdesk";

export function UsersManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<UserRoleTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<UserStatus[]>([]);

  const [userData, setUserData] = useState<User[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "super-admin",
      department: "IT",
      lastActive: "2 hours ago",
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "admin",
      department: "Operations",
      lastActive: "1 day ago",
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "operations",
      department: "Finance",
      lastActive: "Just now",
      status: "active",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      role: "marketing",
      department: "Marketing",
      lastActive: "3 days ago",
      status: "inactive",
      image: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      role: "helpdesk",
      department: "Support",
      lastActive: "1 week ago",
      status: "suspended",
    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@company.com",
      role: "super-admin",
      department: "Executive",
      lastActive: "5 hours ago",
      status: "active",
      image: "/api/placeholder/40/40",
    },
    {
      id: 7,
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      role: "admin",
      department: "HR",
      lastActive: "2 days ago",
      status: "active",
    },
    {
      id: 8,
      name: "Robert Brown",
      email: "robert.brown@company.com",
      role: "operations",
      department: "Logistics",
      lastActive: "1 hour ago",
      status: "pending",
      image: "/api/placeholder/40/40",
    },
    {
      id: 9,
      name: "Jennifer Lee",
      email: "jennifer.lee@company.com",
      role: "marketing",
      department: "Digital Marketing",
      lastActive: "4 days ago",
      status: "active",
    },
    {
      id: 10,
      name: "Thomas Anderson",
      email: "thomas.anderson@company.com",
      role: "helpdesk",
      department: "Customer Support",
      lastActive: "Just now",
      status: "active",
      image: "/api/placeholder/40/40",
    },
  ]);

  const navigate = useNavigate();

  // Available status options for filter
  const statusOptions: { value: UserStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
    { value: "pending", label: "Pending" },
  ];

  // Filter users based on active tab, search query, and selected statuses
  const filteredUsers = useMemo(() => {
    let filtered = userData;

    // Apply tab filter
    switch (activeTab) {
      case "super-admins":
        filtered = filtered.filter((user) => user.role === "super-admin");
        break;
      case "admins":
        filtered = filtered.filter((user) => user.role === "admin");
        break;
      case "operations":
        filtered = filtered.filter((user) => user.role === "operations");
        break;
      case "marketing":
        filtered = filtered.filter((user) => user.role === "marketing");
        break;
      case "helpdesk":
        filtered = filtered.filter((user) => user.role === "helpdesk");
        break;
      case "all":
      default:
        // No additional filtering for "all" tab
        break;
    }

    // Apply status filter if any statuses are selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((user) =>
        selectedStatuses.includes(user.status)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [userData, activeTab, selectedStatuses, searchQuery]);

  const handleStatusFilterChange = (status: UserStatus) => {
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

  const userCards: CardData[] = [
    {
      icon: <Users className="size-4" />,
      iconBgColor: "bg-blue-600",
      title: "Total Staff",
      value: userData.length.toString(),
      change: {
        description: "Total Users",
      },
    },
    {
      icon: <Crown className="size-4" />,
      iconBgColor: "bg-red-600",
      title: "Super Admins",
      value: userData.filter((user) => user.role === "super-admin").length.toString(),
      change: {
        description: "Highest access level",
      },
    },
    {
      icon: <Shield className="size-4" />,
      iconBgColor: "bg-green-600",
      title: "Admins",
      value: userData.filter((user) => user.role === "admin").length.toString(),
      change: {
        description: "General access level",
      },
    },
    {
      icon: <Calculator className="size-4" />,
      iconBgColor: "bg-orange-600",
      title: "Operations Staff",
      value: userData.filter((user) => user.role === "operations").length.toString(),
      change: {
        description: "Finance & Operations",
      },
    },
    {
      icon: <HeadsetIcon className="size-4" />,
      iconBgColor: "bg-purple-600",
      title: "Support Staff",
      value: (userData.filter((user) => user.role === "marketing").length + 
             userData.filter((user) => user.role === "helpdesk").length).toString(),
      change: {
        description: "Marketing & Helpdesk",
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


  const handleDeleteUser = (userId: number) => {
    setUserData((prevData) =>
      prevData.filter((user) => user.id !== userId)
    );
    console.log(`Deleted user: ${userId}`);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const userFields: TableField<User>[] = [
    {
      key: "name",
      header: "User Names",
      enableHiding: false,
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={row.image} alt={row.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (value) => (
        <span className="font-medium capitalize">
          {(value as string).replace('-', ' ')}
        </span>
      ),
    },
    {
      key: "lastActive",
      header: "Last Active",
    },
    {
      key: "status",
      header: "Status ↓",
      cell: (value) => {
        const statusConfig = {
          active: {
            label: "Active",
            dotColor: "bg-green-500",
          },
          inactive: {
            label: "Inactive",
            dotColor: "bg-gray-500",
          },
          suspended: {
            label: "Suspended",
            dotColor: "bg-red-500",
          },
          pending: {
            label: "Pending",
            dotColor: "bg-yellow-500",
          },
        };

        const config =
          statusConfig[value as keyof typeof statusConfig] ||
          statusConfig.active;

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

  const userActions: TableAction<User>[] = [
    {
      type: "edit",
      label: "Edit User",
      icon: <PenIcon className="size-5" />,
      onClick: ()=>navigate("edit-user"),
    },
    {
      type: "delete",
      label: "Delete User",
      icon: <TrashIcon className="size-5" />,
      onClick: handleDeleteClick,
    },
  ];

  return (
    <>
      <SiteHeader
        rightActions={
          <>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-800"
              onClick={() => navigate("/admin/users-management/create-user")}
            >
              <PlusIcon />
              Create User
            </Button>
          </>
        }
      />
      <div className="space-y-6">
        <SectionCards cards={userCards} layout="1x5" />

        <div className="space-y-6">
          {/* Users Section */}
          <div className="rounded-lg border bg-card py-6 mb-6">
            {/* Tabs for filtering users by role */}
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as UserRoleTab)
              }
              className="px-6 w-full bg-transparent rounded-none"
            >
              <TabsList className="grid w-full max-w-full grid-cols-6 rounded-none p-0 bg-transparent border-b">
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                  value="all"
                >
                  All Staff
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                  value="super-admins"
                >
                  Super Admins
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                  value="admins"
                >
                  Admins
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                  value="operations"
                >
                  Operations
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                  value="marketing"
                >
                  Marketing
                </TabsTrigger>
                <TabsTrigger
                  className="bg-transparent border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:dark:border-blue-600 data-[state=active]:dark:text-blue-600 data-[state=active]:dark:bg-transparent"
                  value="helpdesk"
                >
                  Helpdesk
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0"></TabsContent>
              <TabsContent value="super-admins" className="mt-0"></TabsContent>
              <TabsContent value="admins" className="mt-0"></TabsContent>
              <TabsContent value="operations" className="mt-0"></TabsContent>
              <TabsContent value="marketing" className="mt-0"></TabsContent>
              <TabsContent value="helpdesk" className="mt-0"></TabsContent>
            </Tabs>

            {/* Search and Filter Section */}
            <div className="px-6 mt-6 flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
              <div className="w-full">
                <Search
                  placeholder="Search names, email, role, departments..."
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
                Showing {filteredUsers.length} of {userData.length}{" "}
                staff
                {(selectedStatuses.length > 0 || searchQuery) && " (filtered)"}
              </p>
            </div>

            <DataTable<User>
              data={filteredUsers}
              fields={userFields}
              actions={userActions}
              enableSelection={true}
              enablePagination={true}
              pageSize={5}
              onRowClick={(user) => {
                console.log("Row clicked:", user);
              }}
            />
          </div>
        </div>
      </div>


      <DeleteUserDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteUser}
      />
    </>
  );
}